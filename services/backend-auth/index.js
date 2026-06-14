require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// In-memory users and refresh tokens (demo only)
const users = [
  { id: '1', username: 'demo', password: 'password', name: 'Demo User' },
];
const refreshStore = new Map();

function signToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: '15m' });
}

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user);
  const refresh = uuidv4();
  refreshStore.set(refresh, user.id);

  return res.json({ access_token: token, refresh_token: refresh, expires_in: 900 });
});

app.post('/auth/refresh', (req, res) => {
  const { refresh_token } = req.body || {};
  const userId = refreshStore.get(refresh_token);
  if (!userId) return res.status(401).json({ message: 'Invalid refresh token' });
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(401).json({ message: 'User not found' });
  const token = signToken(user);
  return res.json({ access_token: token, expires_in: 900 });
});

app.get('/auth/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === payload.sub);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    return res.json({ id: user.id, username: user.username, name: user.name });
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});
