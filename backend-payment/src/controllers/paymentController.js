const { pool } = require('../config/db');
const { createPayment, findPaymentByReference } = require('../models/Payment');
const { sendPaymentSMS } = require('../services/smsService');

const processPayment = async (req, res) => {
  const { referenceNumber, paymentChannel } = req.body;

  if (!referenceNumber || !paymentChannel) {
    return res.status(400).json({ message: 'Missing referenceNumber or paymentChannel' });
  }

  try {
    // Check if the fine exists and get its status and officer's phone
    const [rows] = await pool.query(
      `SELECT status, officer_phone FROM fines WHERE reference_number = ?`,
      [referenceNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    const fine = rows[0];

    // Check if already paid
    if (fine.status === 'PAID') {
      return res.status(400).json({ message: 'Fine already paid' });
    }

    // Mark fine as paid in fines table
    await pool.query(
      `UPDATE fines SET status = 'PAID', payment_channel = ? WHERE reference_number = ?`,
      [paymentChannel, referenceNumber]
    );

    // Create payment record
    await createPayment(referenceNumber, paymentChannel);

    // Send SMS notification to the traffic officer
    if (fine.officer_phone) {
      await sendPaymentSMS(fine.officer_phone, referenceNumber);
    }

    return res.status(200).json({ message: 'Payment successful. Officer notified via SMS.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Payment failed', error: err.message });
  }
};

module.exports = { processPayment };