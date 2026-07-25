const express = require('express');
const router = express.Router();

const { getPool } = require('../db');
const pool = getPool();
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.use(verifyToken, requireAdmin);

router.get('/stats/overview', async (req, res) => {
  try {
    const [[summaryRow]] = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN p.id IS NOT NULL THEN c.amount_lkr ELSE 0 END), 0) AS totalRevenue,
        COALESCE(COUNT(DISTINCT p.id), 0) AS paidFines,
        COALESCE(SUM(CASE WHEN p.id IS NULL THEN 1 ELSE 0 END), 0) AS pendingCases
      FROM fines f
      INNER JOIN categories c ON c.id = f.category_id
      LEFT JOIN payments p ON p.fine_id = f.id
    `);

    const [revenueRows] = await pool.query(`
      SELECT
        o.district,
        COALESCE(SUM(CASE WHEN p.id IS NOT NULL THEN c.amount_lkr ELSE 0 END), 0) AS revenue
      FROM fines f
      INNER JOIN categories c ON c.id = f.category_id
      INNER JOIN officers o ON o.id = f.officer_id
      LEFT JOIN payments p ON p.fine_id = f.id
      GROUP BY o.district
      ORDER BY revenue DESC, o.district ASC
    `);

    const [recentRows] = await pool.query(`
      SELECT
        p.id AS paymentId,
        f.reference_number AS referenceNumber,
        o.district,
        c.amount_lkr AS amount,
        f.status,
        p.created_at AS paidAt,
        p.cardholder_name AS cardholderName
      FROM fines f
      INNER JOIN categories c ON c.id = f.category_id
      INNER JOIN officers o ON o.id = f.officer_id
      INNER JOIN payments p ON p.fine_id = f.id
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT 5
    `);

    res.json({
      totalRevenue: Number(summaryRow?.totalRevenue || 0),
      paidFines: Number(summaryRow?.paidFines || 0),
      pendingCases: Number(summaryRow?.pendingCases || 0),
      revenueByDistrict: revenueRows.map((row) => ({
        district: row.district,
        revenue: Number(row.revenue || 0),
      })),
      recentPayments: recentRows.map((row) => ({
        referenceNumber: row.referenceNumber,
        district: row.district,
        amount: Number(row.amount || 0),
        status: row.status,
        paidAt: row.paidAt,
        cardholderName: row.cardholderName,
      })),
    });
  } catch (error) {
    console.error('Failed to load dashboard overview:', error);
    res.status(500).json({ error: 'Failed to load dashboard overview' });
  }
});

router.get('/stats/districts', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        o.district,
        COALESCE(COUNT(f.id), 0) AS totalCases,
        COALESCE(SUM(CASE WHEN p.id IS NOT NULL THEN c.amount_lkr ELSE 0 END), 0) AS totalCollection,
        COALESCE(SUM(CASE WHEN p.id IS NULL THEN 1 ELSE 0 END), 0) AS pendingCases
      FROM officers o
      LEFT JOIN fines f ON f.officer_id = o.id
      LEFT JOIN categories c ON c.id = f.category_id
      LEFT JOIN payments p ON p.fine_id = f.id
      GROUP BY o.district
      ORDER BY totalCollection DESC, o.district ASC
    `);

    res.json(
      rows.map((row) => ({
        district: row.district,
        totalCases: Number(row.totalCases || 0),
        totalCollection: Number(row.totalCollection || 0),
        pendingCases: Number(row.pendingCases || 0),
      }))
    );
  } catch (error) {
    console.error('Failed to load district statistics:', error);
    res.status(500).json({ error: 'Failed to load district statistics' });
  }
});

router.get('/stats/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        c.id,
        c.code,
        c.title,
        c.amount_lkr AS amountLkr,
        c.description,
        COALESCE(COUNT(f.id), 0) AS totalCases,
        COALESCE(COUNT(p.id), 0) AS paidCases,
        COALESCE(SUM(CASE WHEN p.id IS NOT NULL THEN c.amount_lkr ELSE 0 END), 0) AS totalCollection
      FROM categories c
      LEFT JOIN fines f ON f.category_id = c.id
      LEFT JOIN payments p ON p.fine_id = f.id
      GROUP BY c.id, c.code, c.title, c.amount_lkr, c.description
      ORDER BY c.title ASC
    `);

    res.json(
      rows.map((row) => ({
        id: row.id,
        code: row.code,
        title: row.title,
        amountLkr: Number(row.amountLkr || 0),
        description: row.description,
        totalCases: Number(row.totalCases || 0),
        paidCases: Number(row.paidCases || 0),
        totalCollection: Number(row.totalCollection || 0),
      }))
    );
  } catch (error) {
    console.error('Failed to load categories:', error);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

module.exports = router;