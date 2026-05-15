const express = require("express");
const dotenv = require("dotenv");
const { initDb } = require("./db");
const { seedInitialAdmin } = require("./bootstrap");
const fineRoutes = require("./fineRoutes");

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "backend-auth" });
});

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
