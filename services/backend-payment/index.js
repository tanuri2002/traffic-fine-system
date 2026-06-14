require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const finesPath = path.join(__dirname, 'data', 'fines.json');
let fines = [];
try {
  fines = JSON.parse(fs.readFileSync(finesPath));
} catch (e) {
  fines = [];
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

// Lookup fine
app.get('/fines', (req, res) => {
  const { ref, category } = req.query;
  const found = fines.find(f => f.referenceNumber === ref && f.categoryId === category);
  if (!found) return res.status(404).json({ message: 'Fine not found' });
  return res.json(found);
});

// Payments require auth
app.post('/payments', verifyToken, (req, res) => {
  const body = req.body || {};
  const { fineReferenceNumber, cardNumber } = body;
  const fine = fines.find(f => f.referenceNumber === fineReferenceNumber);
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

  // Success
  return res.status(201).json({ success: true, message: 'Payment processed', transactionId: txn });
});

app.listen(PORT, () => {
  console.log(`Payment server listening on http://localhost:${PORT}`);
});
