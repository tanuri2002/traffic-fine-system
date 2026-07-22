const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const paymentRoutes = require('./routes/paymentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const categoriesRouter = require('./routes/categories');

app.use('/api/payment', paymentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/categories', categoriesRouter);

module.exports = app;