require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const officerRoutes = require('./routes/officer');
app.use('/api/auth', officerRoutes);

const { verifyToken } = require('./middleware/auth');
app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});

app.listen(process.env.PORT, () =>
  console.log(`backend-auth running on port ${process.env.PORT}`)
);

console.log('MARKER: server.js loaded successfully');
console.log('Auth routes:', authRoutes.stack.map(r => r.route && r.route.path));
