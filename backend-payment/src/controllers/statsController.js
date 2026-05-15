const { pool } = require('../config/db');

const getDistrictStats = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT district, COUNT(*) as total_fines, SUM(amount) as total_amount
       FROM fines
       WHERE status = 'PAID'
       GROUP BY district`
    );
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching district stats' });
  }
};

const getCategoryStats = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT category_id, COUNT(*) as total_fines, SUM(amount) as total_amount
       FROM fines
       WHERE status = 'PAID'
       GROUP BY category_id`
    );
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching category stats' });
  }
};

module.exports = { getDistrictStats, getCategoryStats };