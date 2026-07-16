const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const paymentRoutes = require('./routes/paymentRoutes');
const statsRoutes = require('./routes/statsRoutes');

app.use('/api/payment', paymentRoutes);
app.use('/api/stats', statsRoutes);

module.exports = app;