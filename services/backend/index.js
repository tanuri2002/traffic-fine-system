require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// MySQL
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// -------------------------
// Data (fines)
// -------------------------
const finesPath = path.join(__dirname, 'data', 'fines.json');
let fines = [];
try {
  fines = JSON.parse(fs.readFileSync(finesPath));
} catch (e) {
  fines = [];
}

// -------------------------
// MySQL pool (shared)
// -------------------------
async function getPool() {
  if (global.__mysqlPool) return global.__mysqlPool;

  global.__mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'traffic_fine_db',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  });

  return global.__mysqlPool;
}

async function testDbConnection() {
  try {
    const pool = await getPool();
    await pool.query('SELECT 1');
  } catch (e) {
    console.error('MySQL connection test failed:', e.message);
  }
}

// -------------------------
// Auth helpers (JWT + demo users)
// -------------------------
function signToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: '15m' });
}

// Demo in-memory refresh tokens (until DB schema is added)
const refreshStore = new Map();

async function findUserByCredentials(username, password) {
  // Current implementation keeps the existing demo user.
  const demoUser = { id: '1', username: 'demo', password: 'password', name: 'Demo User' };
  const user = demoUser.username === username && demoUser.password === password ? demoUser : null;
  return user;
}

function verifyToken(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// -------------------------
// Auth endpoints
// -------------------------
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body || {};

  const user = await findUserByCredentials(username, password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user);
  const refresh = uuidv4();
  refreshStore.set(refresh, user.id);

  await testDbConnection();

  // Flutter expects access_token/token and refresh_token
  return res.json({ access_token: token, refresh_token: refresh, expires_in: 900 });
});

app.post('/auth/refresh', async (req, res) => {
  const { refresh_token } = req.body || {};
  const userId = refreshStore.get(refresh_token);
  if (!userId) return res.status(401).json({ message: 'Invalid refresh token' });

  // Demo lookup
  if (userId !== '1') return res.status(401).json({ message: 'User not found' });
  const user = { id: '1', username: 'demo', password: 'password', name: 'Demo User' };

  const token = signToken(user);
  return res.json({ access_token: token, expires_in: 900 });
});

app.get('/auth/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = payload.sub === '1' ? { id: '1', username: 'demo', name: 'Demo User' } : null;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    return res.json({ id: user.id, username: user.username, name: user.name });
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// -------------------------
// Register endpoint (required by Flutter)
// -------------------------
app.post('/auth/register', async (req, res) => {
  // Demo-only: accepts any username/password/name and maps to demo user.
  // (Replace with DB-backed user creation when schema is ready.)
  const { username, password, name } = req.body || {};

  if (!username || !password || !name) {
    return res.status(400).json({ message: 'username, password, name are required' });
  }

  // If you want actual persistence, implement it here.
  // For now, always issue tokens for the demo user.
  const demoUser = { id: '1', username: 'demo', password: 'password', name: 'Demo User' };

  const token = signToken(demoUser);
  const refresh = uuidv4();
  refreshStore.set(refresh, demoUser.id);

  await testDbConnection();

  return res.status(201).json({
    access_token: token,
    refresh_token: refresh,
    expires_in: 900,
  });
});

// -------------------------
// Fines + Payments endpoints
// -------------------------
app.get('/fines', async (req, res) => {
  await testDbConnection();

  const { ref, category } = req.query;
  const found = fines.find((f) => f.referenceNumber === ref && f.categoryId === category);
  if (!found) return res.status(404).json({ message: 'Fine not found' });
  return res.json(found);
});

app.post('/payments', verifyToken, async (req, res) => {
  await testDbConnection();

  const body = req.body || {};
  const { fineReferenceNumber, cardNumber } = body;

  const fine = fines.find((f) => f.referenceNumber === fineReferenceNumber);
  if (!fine) return res.status(404).json({ message: 'Fine not found' });

  // Simulate card rules: 1111 -> success, 2222 -> declined, 3333 -> expired
  const cleaned = (cardNumber || '').replace(/\s+/g, '');
  const prefix = cleaned.substring(0, 4);
  const txn = uuidv4();

  if (prefix === '2222') {
    return res.status(200).json({ success: false, message: 'declined', transactionId: txn });
  }
  if (prefix === '3333') {
    return res.status(200).json({ success: false, message: 'expired', transactionId: txn });
  }

  return res.status(201).json({ success: true, message: 'Payment processed', transactionId: txn });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

