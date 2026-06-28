const mysql = require("mysql2/promise");

let pool;

function getServerConfig() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_USER) {
    throw new Error("Database environment variables are not fully configured");
  }

  return {
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    user: DB_USER,
    password: DB_PASSWORD || ""
  };
}

async function ensureDatabaseExists() {
  const { DB_NAME } = process.env;

  if (!DB_NAME) {
    throw new Error("DB_NAME is not set");
  }

  const connection = await mysql.createConnection(getServerConfig());

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await connection.end();
  }
}

function getPool() {
  if (pool) {
    return pool;
  }

  const { DB_NAME } = process.env;

  if (!DB_NAME) {
    throw new Error("Database environment variables are not fully configured");
  }

  pool = mysql.createPool({
    ...getServerConfig(),
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
  });

  return pool;
}

async function initDb() {
  await ensureDatabaseExists();

  const connection = await getPool().getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS officers (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        badge_number VARCHAR(50) NOT NULL,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        district VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('officer', 'admin') NOT NULL DEFAULT 'officer',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_officers_badge_number (badge_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        code VARCHAR(30) NOT NULL,
        title VARCHAR(150) NOT NULL,
        amount_lkr DECIMAL(10,2) NOT NULL,
        description TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_categories_code (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS app_users (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        full_name VARCHAR(150) NOT NULL,
        username VARCHAR(80) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_app_users_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS fines (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        reference_number VARCHAR(60) NOT NULL,
        category_id BIGINT UNSIGNED NOT NULL,
        officer_id BIGINT UNSIGNED NOT NULL,
        driver_license_no VARCHAR(60) NOT NULL,
        vehicle_no VARCHAR(30) NOT NULL,
        status ENUM('UNPAID', 'PAID') NOT NULL DEFAULT 'UNPAID',
        paid_at DATETIME NULL,
        payment_channel ENUM('MOBILE', 'WEB') NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_fines_reference_number (reference_number),
        KEY idx_fines_officer_id (officer_id),
        KEY idx_fines_category_id (category_id),
        CONSTRAINT fk_fines_category_id FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_fines_officer_id FOREIGN KEY (officer_id) REFERENCES officers (id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } finally {
    connection.release();
  }

  console.log("MySQL connected and schema initialized for backend-auth");
}

module.exports = {
  getPool,
  initDb
};
