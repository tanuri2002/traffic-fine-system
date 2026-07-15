const express = require('express');
const router = express.Router();
const { getFineDetails, processPayment } = require('../controllers/paymentController');

router.get('/fine', getFineDetails);
router.post('/pay', processPayment);

module.exports = router;