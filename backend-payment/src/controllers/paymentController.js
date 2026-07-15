const { pool } = require('../config/db');
const { sendOfficerPaymentSms } = require('../services/smsService');

const getFineDetails = async (req, res) => {
  const referenceNumber = req.query.referenceNumber || req.body.referenceNumber;
  const categoryId = req.query.categoryId || req.body.categoryId;

  if (!referenceNumber || !categoryId) {
    return res.status(400).json({ message: 'Missing referenceNumber or categoryId' });
  }

  try {
    // Step 1: Find the fine by reference_number only
    const [fineRows] = await pool.query(
      `SELECT id, category_id, officer_id, status
       FROM fines
       WHERE reference_number = ?`,
      [referenceNumber]
    );

    if (fineRows.length === 0) {
      return res.status(404).json({ message: 'fine not found' });
    }

    const fine = fineRows[0];

    // Step 2: Check the category matches
    if (String(fine.category_id) !== String(categoryId)) {
      return res.status(404).json({ message: 'category does not match this fine' });
    }

    // Step 3: Check the fine isn't already paid
    if (fine.status !== 'UNPAID') {
      return res.status(404).json({ message: 'fine already paid' });
    }

    // All checks pass: return fine summary + payment screen data via joins
    // (Keep controller logic only; no FK structure changes)
    const [rows] = await pool.query(
      `SELECT
         f.id,
         f.reference_number,
         f.category_id,
         f.officer_id,
         f.driver_license_no,
         f.vehicle_no,
         f.status,
         f.paid_at,
         f.payment_channel,
         f.created_at,
         f.updated_at,
         c.name AS category_name,
         o.name AS officer_name,
         o.phone AS officer_phone
       FROM fines f
       LEFT JOIN categories c ON c.id = f.category_id
       LEFT JOIN officers o ON o.id = f.officer_id
       WHERE f.id = ?`,
      [fine.id]
    );

    // Should always exist because we just fetched it
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch fine details', error: err.message });
  }
};


const processPayment = async (req, res) => {
  const {
    referenceNumber,
    categoryId,
    paymentChannel,
    cardholderName,
    cardNumber,
    expiryDate,
    cvv,
  } = req.body;

  if (!referenceNumber || !categoryId || !paymentChannel) {
    return res.status(400).json({ message: 'Missing referenceNumber, categoryId, or paymentChannel' });
  }

  if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
    return res.status(400).json({ message: 'Missing cardholderName, cardNumber, expiryDate, or cvv' });
  }

  const conn = await pool.getConnection();
  let fineId;
  let officerId;

  try {
    await conn.beginTransaction();

    // Step 1: Find the fine by reference_number only
    const [fineRows] = await conn.query(
      `SELECT id, category_id, officer_id, status
       FROM fines
       WHERE reference_number = ?
       LIMIT 1`,
      [referenceNumber]
    );

    if (fineRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'fine not found' });
    }

    const fine = fineRows[0];
    fineId = fine.id;
    officerId = fine.officer_id;

    // Step 2: Only block payments that are already finalized.
    if (String(fine.status).toUpperCase() === 'PAID') {
      await conn.rollback();
      return res.status(200).json({
        success: true,
        message: 'Fine already paid.',
        transactionId: null,
        timestamp: new Date().toISOString(),
        referenceNumber,
        categoryId: categoryId || fine.category_id,
        paymentChannel,
      });
    }

    const normalizedCategoryId = categoryId || fine.category_id;


    // Step 4: insert payment row
    // Assumes `payments` table matches the traffic_fine_auth schema.
    const [paymentResult] = await conn.query(
      `INSERT INTO payments (fine_id, cardholder_name, card_number, expiry_date, cvv, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [fineId, cardholderName, cardNumber, expiryDate, cvv]
    );


    // Step 3: update fine row
    const [updateResult] = await conn.query(
      `UPDATE fines
       SET status = 'PAID', payment_channel = ?, paid_at = NOW()
       WHERE id = ? AND status = 'UNPAID'`,
      [paymentChannel, fineId]
    );

    if (!updateResult || updateResult.affectedRows !== 1) {
      await conn.rollback();
      return res.status(200).json({
        success: true,
        message: 'Payment was already processed.',
        transactionId: String(paymentResult.insertId),
        timestamp: new Date().toISOString(),
        referenceNumber,
        categoryId: normalizedCategoryId,
        paymentChannel,
      });
    }

    await conn.commit();

    // Step 4: send SMS after commit (do not block response)
    (async () => {
      try {
        const [phoneRows] = await pool.query(
          `SELECT phone
           FROM officers
           WHERE id = (SELECT officer_id FROM fines WHERE id = ?)`,
          [fineId]
        );

        const officerPhone = phoneRows[0]?.phone;

        // smsService currently uses env OFFICER_PHONE_NUMBER; it will skip if not configured.
        // We still call it asynchronously as required.
        await sendOfficerPaymentSms({
          officerId,
          officerPhone,
          referenceNumber,
          categoryId: normalizedCategoryId,
          paymentChannel,
        });
      } catch (smsErr) {
        console.error('SMS send failed (post-commit):', smsErr);
      }
    })();

    return res.status(200).json({
      success: true,
      message: 'Payment successful.',
      transactionId: String(paymentResult.insertId),
      timestamp: new Date().toISOString(),
      referenceNumber,
      categoryId: normalizedCategoryId,
      paymentChannel,
    });
  } catch (err) {
    try {
      await conn.rollback();
    } catch (rollbackErr) {
      console.error('Rollback failed:', rollbackErr);
    }
    console.error(err);
    return res.status(500).json({ message: 'Payment failed', error: err.message });
  } finally {
    conn.release();
  }
};

module.exports = { getFineDetails, processPayment };

