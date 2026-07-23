const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

function toAdminModel(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    officialEmail: row.official_email,
    badgeNumber: row.badge_number,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toPublicAdmin(admin) {
  const { passwordHash, ...safe } = admin;
  return safe;
}

// SIGNUP — for admin-portal registration
router.post('/signup', async (req, res) => {
  try {
    const { fullName, officialEmail, badgeNumber, password } = req.body;

    if (!fullName || !officialEmail || !badgeNumber || !password) {
      return res.status(400).json({
        error: 'fullName, officialEmail, badgeNumber, and password are required'
      });
    }

    const [existing] = await pool.query(
      'SELECT id FROM administrators WHERE official_email = ? OR badge_number = ?',
      [officialEmail, badgeNumber]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Official email or badge number already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO administrators (full_name, official_email, badge_number, password_hash) VALUES (?, ?, ?, ?)',
      [fullName, officialEmail, badgeNumber, passwordHash]
    );

    const [rows] = await pool.query('SELECT * FROM administrators WHERE id = ?', [result.insertId]);
    const admin = toAdminModel(rows[0]);

    res.status(201).json({ ...toPublicAdmin(admin), role: 'admin' });
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
      'SELECT * FROM administrators WHERE badge_number = ?',
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
      { id: row.id, badgeNumber: row.badge_number, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const admin = toAdminModel(row);
    res.json({ token, officer: { ...toPublicAdmin(admin), role: 'admin' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;