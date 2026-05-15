const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/pay', verifyToken, processPayment);

module.exports = router;