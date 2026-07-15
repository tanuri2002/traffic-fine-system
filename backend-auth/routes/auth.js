const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Matches your teammate's naming convention exactly.
// Used internally only — never send passwordHash back to the client.
function toOfficerModel(row) {
  return {
    id: row.id,
    badgeNumber: row.badge_number,
    name: row.name,
    phone: row.phone,
    district: row.district,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Safe version for API responses — strips passwordHash
function toPublicOfficer(officer) {
  const { passwordHash, ...safe } = officer;
  return safe;
}

// SIGNUP — for admin-portal registration
router.post('/signup', async (req, res) => {
  try {
    const { badgeNumber, name, phone, district, password } = req.body;

    if (!badgeNumber || !name || !phone || !district || !password) {
      return res.status(400).json({
        error: 'badgeNumber, name, phone, district, and password are required'
      });
    }

    const [existing] = await pool.query(
      'SELECT id FROM officers WHERE badge_number = ?',
      [badgeNumber]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Badge number already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO officers (badge_number, name, phone, district, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [badgeNumber, name, phone, district, passwordHash, 'admin']
    );

    const [rows] = await pool.query('SELECT * FROM officers WHERE id = ?', [result.insertId]);
    const officer = toOfficerModel(rows[0]);

    res.status(201).json(toPublicOfficer(officer));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// LOGIN — issues the JWT
router.post('/login', async (req, res) => {
  try {
    const { badgeNumber, password } = req.body;

    if (!badgeNumber || !password) {
      return res.status(400).json({ error: 'badgeNumber and password are required' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM officers WHERE badge_number = ?',
      [badgeNumber]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid badge number or password' });
    }

    const row = rows[0];
    const match = await bcrypt.compare(password, row.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid badge number or password' });
    }

    const token = jwt.sign(
      { id: row.id, badgeNumber: row.badge_number, role: row.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const officer = toOfficerModel(row);
    res.json({ token, officer: toPublicOfficer(officer) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;