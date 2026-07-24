const express = require('express');
const router = express.Router();
const { getPool } = require('../db');
const pool = getPool();

router.get('/officer', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM officer_registry ORDER BY id DESC');
  res.json(rows);
});

router.post('/officer', async (req, res) => {
  const { badgeNumber, name, phone, district, active = true } = req.body;

  if (!badgeNumber || !name || !phone || !district) {
    return res.status(400).json({
      error: 'badgeNumber, name, phone, and district are required'
    });
  }

  const [result] = await pool.query(
    'INSERT INTO officer_registry (badge_number, name, phone, district, active) VALUES (?, ?, ?, ?, ?)',
    [badgeNumber, name, phone, district, active ? 1 : 0]
  );
  res.json({ id: result.insertId });
});

router.put('/officer/:id', async (req, res) => {
  const { badgeNumber, name, phone, district, active } = req.body;

  if (!badgeNumber || !name || !phone || !district) {
    return res.status(400).json({
      error: 'badgeNumber, name, phone, and district are required'
    });
  }

  await pool.query(
    'UPDATE officer_registry SET badge_number=?, name=?, phone=?, district=?, active=? WHERE id=?',
    [badgeNumber, name, phone, district, active ? 1 : 0, req.params.id]
  );
  res.json({ success: true });
});

router.delete('/officer/:id', async (req, res) => {
  await pool.query('DELETE FROM officer_registry WHERE id=?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;