const mysql = require('mysql2/promise');
require('dotenv').config();

const connectionConfig = process.env.DATABASE_URL
  ? process.env.DATABASE_URL + '?connectionLimit=5'  // optional, or set below
  : {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

const pool = process.env.DATABASE_URL
  ? mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 5,        // keep low — Railway free/hobby tiers cap total connections
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  })
  : mysql.createPool({
    ...connectionConfig,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });

module.exports = { pool };