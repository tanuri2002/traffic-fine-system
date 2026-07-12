const { pool } = require('../config/db');

const getFineDetails = async (req, res) => {
  const referenceNumber = req.query.referenceNumber || req.body.referenceNumber;
  const categoryId = req.query.categoryId || req.body.categoryId;

  if (!referenceNumber || !categoryId) {
    return res.status(400).json({ message: 'Missing referenceNumber or categoryId' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id, reference_number, category_id, officer_id, driver_license_no, vehicle_no, status, paid_at, payment_channel, created_at, updated_at
       FROM fines
       WHERE reference_number = ? AND category_id = ?`,
      [referenceNumber, categoryId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch fine details', error: err.message });
  }
};

const processPayment = async (req, res) => {
  const { referenceNumber, categoryId, paymentChannel } = req.body;

  if (!referenceNumber || !categoryId || !paymentChannel) {
    return res.status(400).json({ message: 'Missing referenceNumber, categoryId, or paymentChannel' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id, status FROM fines WHERE reference_number = ? AND category_id = ?`,
      [referenceNumber, categoryId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    const fine = rows[0];

    if (fine.status === 'PAID') {
      return res.status(400).json({ message: 'Fine already paid' });
    }

    await pool.query(
      `UPDATE fines
       SET status = 'PAID', payment_channel = ?, paid_at = NOW()
       WHERE reference_number = ? AND category_id = ?`,
      [paymentChannel, referenceNumber, categoryId]
    );

    return res.status(200).json({ message: 'Payment successful.', referenceNumber, categoryId, paymentChannel });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Payment failed', error: err.message });
  }
};

module.exports = { getFineDetails, processPayment };