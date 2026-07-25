const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/categories
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, code, title, amount_lkr, description FROM categories ORDER BY id ASC');
        res.json({ data: rows });
    } catch (err) {
        console.error('Failed to fetch categories:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

module.exports = router;