const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const paymentRoutes = require('./routes/paymentRoutes');
const statsRoutes = require('./routes/statsRoutes');


app.use('/api/payment', paymentRoutes);
app.use('/api/stats', statsRoutes);

module.exports = app;