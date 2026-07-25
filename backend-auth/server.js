const express = require("express");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { initDb, getPool } = require("./db");
const { seedInitialAdmin } = require("./bootstrap");
const fineRoutes = require("./fineRoutes");
const { getJwtSecret } = require("./jwtUtil");
const { verifyToken, requireAdmin } = require("./middleware/auth");

dotenv.config();

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Officer register/login (from incoming)
const { registerOfficer, loginOfficer } = require("./fineController");
const authRouter = express.Router();
authRouter.post("/officer", registerOfficer);
authRouter.post("/officer/login", loginOfficer);
// Backward-compatible endpoints used by older clients.
authRouter.post("/register", registerOfficer);
authRouter.post("/login", loginOfficer);
app.use("/auth", authRouter);
app.use("/api/auth", authRouter);

// Existing route modules (from HEAD)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const officerRoutes = require('./routes/officer');
app.use('/api/auth', officerRoutes);

const statsRoutes = require('./routes/stats');
app.use('/api/auth', statsRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "backend-auth" });
});

// Payment service proxy
const PAYMENT_TARGET = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3001';
app.use('/api/payment', createProxyMiddleware({
  target: PAYMENT_TARGET,
  changeOrigin: true,
  pathRewrite: { '^/': '/api/payment/' },
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      }
    },
  },
}));

app.use("/api", fineRoutes);

// Dashboard stats endpoints (from HEAD) — updated to use getPool()
app.get('/api/auth/stats/overview', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
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
      SELECT o.district,
        COALESCE(SUM(CASE WHEN p.id IS NOT NULL THEN c.amount_lkr ELSE 0 END), 0) AS revenue
      FROM fines f
      INNER JOIN categories c ON c.id = f.category_id
      INNER JOIN officers o ON o.id = f.officer_id
      LEFT JOIN payments p ON p.fine_id = f.id
      GROUP BY o.district
      ORDER BY revenue DESC, o.district ASC
    `);

    const [recentRows] = await pool.query(`
      SELECT p.id AS paymentId, f.reference_number AS referenceNumber, o.district,
        c.amount_lkr AS amount, f.status, p.created_at AS paidAt, p.cardholder_name AS cardholderName
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

app.get('/api/auth/stats/districts', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT o.district,
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

    res.json(rows.map((row) => ({
      district: row.district,
      totalCases: Number(row.totalCases || 0),
      totalCollection: Number(row.totalCollection || 0),
      pendingCases: Number(row.pendingCases || 0),
    })));
  } catch (error) {
    console.error('Failed to load district statistics:', error);
    res.status(500).json({ error: 'Failed to load district statistics' });
  }
});

app.get('/api/auth/stats/categories', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT c.id, c.code, c.title, c.amount_lkr AS amountLkr, c.description,
        COALESCE(COUNT(f.id), 0) AS totalCases,
        COALESCE(COUNT(p.id), 0) AS paidCases,
        COALESCE(SUM(CASE WHEN p.id IS NOT NULL THEN c.amount_lkr ELSE 0 END), 0) AS totalCollection
      FROM categories c
      LEFT JOIN fines f ON f.category_id = c.id
      LEFT JOIN payments p ON p.fine_id = f.id
      GROUP BY c.id, c.code, c.title, c.amount_lkr, c.description
      ORDER BY c.title ASC
    `);

    res.json(rows.map((row) => ({
      id: row.id,
      code: row.code,
      title: row.title,
      amountLkr: Number(row.amountLkr || 0),
      description: row.description,
      totalCases: Number(row.totalCases || 0),
      paidCases: Number(row.paidCases || 0),
      totalCollection: Number(row.totalCollection || 0),
    })));
  } catch (error) {
    console.error('Failed to load categories:', error);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || "Internal server error" });
});

const port = process.env.PORT || 5001;

async function startServer() {
  try {
    try {
      getJwtSecret();
    } catch (err) {
      console.error("JWT configuration invalid:", err.message);
      process.exit(1);
    }

    await initDb();
    await seedInitialAdmin();

    app.listen(port, () => {
      console.log(`backend-auth running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend-auth:", error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;