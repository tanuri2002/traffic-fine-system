const { pool } = require('../config/db');

const createPayment = async (referenceNumber, paymentChannel) => {
  const [result] = await pool.query(
    `INSERT INTO payments (reference_number, payment_channel, paid_at)
     VALUES (?, ?, NOW())`,
    [referenceNumber, paymentChannel]
  );
  return result;
};

const findPaymentByReference = async (referenceNumber) => {
  const [rows] = await pool.query(
    `SELECT * FROM payments WHERE reference_number = ?`,
    [referenceNumber]
  );
  return rows[0];
};

module.exports = { createPayment, findPaymentByReference };