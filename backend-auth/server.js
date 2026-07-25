const express = require("express");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { initDb } = require("./db");
const { seedInitialAdmin } = require("./bootstrap");
const fineRoutes = require("./fineRoutes");

dotenv.config();

const { getJwtSecret } = require("./jwtUtil");

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const { registerOfficer, loginOfficer } = require("./fineController");
const authRouter = express.Router();
authRouter.post("/officer", registerOfficer);
authRouter.post("/officer/login", loginOfficer);
// Backward-compatible endpoints used by older clients.
authRouter.post("/register", registerOfficer);
authRouter.post("/login", loginOfficer);
app.use("/auth", authRouter);
app.use("/api/auth", authRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "backend-auth" });
});

// Proxy /api/payment/* requests to backend-payment service
const PAYMENT_TARGET = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3001';
app.use('/api/payment', createProxyMiddleware({
  target: PAYMENT_TARGET,
  changeOrigin: true,
  pathRewrite: {
    '^/': '/api/payment/'
  },
  on: {
    proxyReq: (proxyReq, req) => {
      // Forward Authorization header if present
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      }
    },
  },
}));

app.use("/api", fineRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error"
  });
});

const port = process.env.PORT || 5001;

async function startServer() {
  try {
    // validate critical config early (will throw if missing or weak)
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
