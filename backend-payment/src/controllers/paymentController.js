const { pool } = require('../config/db');
const { createPayment, findPaymentByReference } = require('../models/Payment');
const { sendPaymentSMS } = require('../services/smsService');

const processPayment = async (req, res) => {
  const { referenceNumber, paymentChannel } = req.body;

  try {
    // Check if already paid
    const existing = await findPaymentByReference(referenceNumber);
    if (existing) {
      return res.status(400).json({ message: 'Fine already paid' });
    }

    // Mark fine as paid in fines table
    await pool.query(
      `UPDATE fines SET status = 'PAID', payment_channel = ? WHERE reference_number = ?`,
      [paymentChannel, referenceNumber]
    );

    // Create payment record
    await createPayment(referenceNumber, paymentChannel);

    // Get officer phone to send SMS
    const [rows] = await pool.query(
      `SELECT officer_phone FROM fines WHERE reference_number = ?`,
      [referenceNumber]
    );

    if (rows.length > 0) {
      await sendPaymentSMS(rows[0].officer_phone, referenceNumber);
    }

    return res.status(200).json({ message: 'Payment successful. Officer notified via SMS.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Payment failed', error: err.message });
  }
};

module.exports = { processPayment };