const { pool } = require('../config/db');

const getDistrictStats = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT officer_id, COUNT(*) as total_fines,
              SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END) as paid_fines,
              SUM(CASE WHEN status = 'UNPAID' THEN 1 ELSE 0 END) as unpaid_fines
       FROM fines
       GROUP BY officer_id
       ORDER BY officer_id`
    );
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching district stats' });
  }
};

const getCategoryStats = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT category_id, COUNT(*) as total_fines,
              SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END) as paid_fines,
              SUM(CASE WHEN status = 'UNPAID' THEN 1 ELSE 0 END) as unpaid_fines
       FROM fines
       GROUP BY category_id
       ORDER BY category_id`
    );
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching category stats' });
  }
};

module.exports = { getDistrictStats, getCategoryStats };