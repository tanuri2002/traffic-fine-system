const { getPool } = require("./db");

function trimString(value) {
  return String(value || "").trim();
}

function normalizeReference(value) {
  return trimString(value).toUpperCase();
}

function normalizeCode(value) {
  return trimString(value).toUpperCase();
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function isPositiveIntegerLike(value) {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
}

function normalizePaymentChannel(value) {
  const normalized = normalizeCode(value);

  if (normalized === "MOBILE" || normalized === "WEB") {
    return normalized;
  }

  return null;
}

function mapFine(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    referenceNumber: row.reference_number,
    categoryId: row.category_id,
    officerId: row.officer_id,
    driverLicenseNo: row.driver_license_no,
    driverName: row.driver_name,
    vehicleNo: row.vehicle_no,
    status: row.status,
    paidAt: row.paid_at,
    paymentChannel: row.payment_channel,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.category || null,
    officer: row.officer || null
  };
}

async function findFineByReference(referenceNumber) {
  const [rows] = await getPool().query(
    "SELECT * FROM fines WHERE reference_number = ? LIMIT 1",
    [referenceNumber]
  );

  return mapFine(rows[0]);
}

async function findFineByReferenceWithDetails(referenceNumber) {
  const [rows] = await getPool().query(
    `SELECT
       f.*,
       c.id AS category_id_join,
       c.code AS category_code,
       c.title AS category_title,
       c.amount_lkr AS category_amount_lkr,
       c.description AS category_description,
       o.id AS officer_join_id,
       o.badge_number AS officer_badge_number,
       o.name AS officer_name,
       o.phone AS officer_phone,
       o.district AS officer_district,
       o.role AS officer_role
     FROM fines f
     INNER JOIN categories c ON c.id = f.category_id
     INNER JOIN officers o ON o.id = f.officer_id
     WHERE f.reference_number = ?
     LIMIT 1`,
    [referenceNumber]
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  return mapFine({
    ...row,
    category: {
      id: row.category_id_join,
      code: row.category_code,
      title: row.category_title,
      amountLkr: Number(row.category_amount_lkr),
      description: row.category_description
    },
    officer: {
      id: row.officer_join_id,
      badgeNumber: row.officer_badge_number,
      name: row.officer_name,
      phone: row.officer_phone,
      district: row.officer_district,
      role: row.officer_role
    }
  });
}

async function createFine({ referenceNumber, categoryId, officerId, driverLicenseNo, driverName, vehicleNo }) {
  const normalizedReferenceNumber = normalizeReference(referenceNumber);
  const normalizedDriverLicenseNo = normalizeCode(driverLicenseNo);
  const normalizedDriverName = trimString(driverName);
  const normalizedVehicleNo = normalizeCode(vehicleNo);

  if (!normalizedReferenceNumber || !isPositiveIntegerLike(categoryId) || !isPositiveIntegerLike(officerId) || !normalizedDriverLicenseNo || !normalizedDriverName || !normalizedVehicleNo) {
    throw createValidationError("Invalid fine payload");
  }

  const [result] = await getPool().query(
    `INSERT INTO fines (reference_number, category_id, officer_id, driver_license_no, driver_name, vehicle_no)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [normalizedReferenceNumber, Number(categoryId), Number(officerId), normalizedDriverLicenseNo, normalizedDriverName, normalizedVehicleNo]
  );

  const [rows] = await getPool().query("SELECT * FROM fines WHERE id = ? LIMIT 1", [result.insertId]);
  return mapFine(rows[0]);
}

async function listFinesByOfficerId(officerId) {
  const [rows] = await getPool().query(
    `SELECT
       f.*,
       c.code AS category_code,
       c.title AS category_title,
       c.amount_lkr AS category_amount_lkr,
       c.description AS category_description
     FROM fines f
     INNER JOIN categories c ON c.id = f.category_id
     WHERE f.officer_id = ?
     ORDER BY f.created_at DESC`,
    [officerId]
  );

  return rows.map((row) =>
    mapFine({
      ...row,
      category: {
        id: row.category_id,
        code: row.category_code,
        title: row.category_title,
        amountLkr: Number(row.category_amount_lkr),
        description: row.category_description
      }
    })
  );
}

async function updateFineAsPaid(referenceNumber, paymentChannel) {
  const normalizedReferenceNumber = normalizeReference(referenceNumber);
  const normalizedPaymentChannel = normalizePaymentChannel(paymentChannel);

  if (!normalizedReferenceNumber) {
    throw createValidationError("Invalid reference number");
  }

  if (!normalizedPaymentChannel) {
    throw createValidationError("Invalid payment channel");
  }

  await getPool().query(
    `UPDATE fines
     SET status = 'PAID', payment_channel = ?, paid_at = NOW()
     WHERE reference_number = ?`,
    [normalizedPaymentChannel, normalizedReferenceNumber]
  );

  return findFineByReference(normalizedReferenceNumber);
}

async function updateFineAsPaidIfUnpaid(referenceNumber, paymentChannel) {
  const normalizedReferenceNumber = normalizeReference(referenceNumber);
  const normalizedPaymentChannel = normalizePaymentChannel(paymentChannel);

  if (!normalizedReferenceNumber) {
    throw createValidationError("Invalid reference number");
  }

  if (!normalizedPaymentChannel) {
    throw createValidationError("Invalid payment channel");
  }

  const [result] = await getPool().query(
    `UPDATE fines
     SET status = 'PAID', payment_channel = ?, paid_at = NOW()
     WHERE reference_number = ? AND status = 'UNPAID'`,
    [normalizedPaymentChannel, normalizedReferenceNumber]
  );

  return result.affectedRows > 0;
}

async function findPaidFineByReferenceWithDetails(referenceNumber) {
  const [rows] = await getPool().query(
    `SELECT
       f.*,
       c.id AS category_id_join,
       c.code AS category_code,
       c.title AS category_title,
       c.amount_lkr AS category_amount_lkr,
       c.description AS category_description,
       o.id AS officer_join_id,
       o.badge_number AS officer_badge_number,
       o.name AS officer_name,
       o.phone AS officer_phone,
       o.district AS officer_district,
       o.role AS officer_role
     FROM fines f
     INNER JOIN categories c ON c.id = f.category_id
     INNER JOIN officers o ON o.id = f.officer_id
     WHERE f.reference_number = ? AND f.status = 'PAID'
     LIMIT 1`,
    [referenceNumber]
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  return mapFine({
    ...row,
    category: {
      id: row.category_id_join,
      code: row.category_code,
      title: row.category_title,
      amountLkr: Number(row.category_amount_lkr),
      description: row.category_description
    },
    officer: {
      id: row.officer_join_id,
      badgeNumber: row.officer_badge_number,
      name: row.officer_name,
      phone: row.officer_phone,
      district: row.officer_district,
      role: row.officer_role
    }
  });
}

function buildPaidDateFilter(startDate, endDate) {
  const clauses = ["f.status = 'PAID'"];
  const params = [];

  if (startDate) {
    clauses.push("f.paid_at >= ?");
    params.push(startDate);
  }

  if (endDate) {
    clauses.push("f.paid_at <= ?");
    params.push(endDate);
  }

  return {
    where: clauses.join(" AND "),
    params
  };
}

async function getDistrictCollectionSummary({ startDate, endDate }) {
  const dateFilter = buildPaidDateFilter(startDate, endDate);

  const [rows] = await getPool().query(
    `SELECT
       o.district AS district,
       COUNT(*) AS total_paid_fines,
       COALESCE(SUM(c.amount_lkr), 0) AS total_amount_lkr
     FROM fines f
     INNER JOIN officers o ON o.id = f.officer_id
     INNER JOIN categories c ON c.id = f.category_id
     WHERE ${dateFilter.where}
     GROUP BY o.district
     ORDER BY total_amount_lkr DESC, district ASC`,
    dateFilter.params
  );

  return rows.map((row) => ({
    district: row.district,
    totalPaidFines: Number(row.total_paid_fines),
    totalAmountLkr: Number(row.total_amount_lkr)
  }));
}

async function getCategoryCollectionSummary({ startDate, endDate }) {
  const dateFilter = buildPaidDateFilter(startDate, endDate);

  const [rows] = await getPool().query(
    `SELECT
       c.id AS category_id,
       c.code AS category_code,
       c.title AS category_title,
       COUNT(*) AS total_paid_fines,
       COALESCE(SUM(c.amount_lkr), 0) AS total_amount_lkr
     FROM fines f
     INNER JOIN categories c ON c.id = f.category_id
     WHERE ${dateFilter.where}
     GROUP BY c.id, c.code, c.title
     ORDER BY total_amount_lkr DESC, c.code ASC`,
    dateFilter.params
  );

  return rows.map((row) => ({
    category: {
      id: row.category_id,
      code: row.category_code,
      title: row.category_title
    },
    totalPaidFines: Number(row.total_paid_fines),
    totalAmountLkr: Number(row.total_amount_lkr)
  }));
}

async function createPayment({ fineId, cardholderName, cardNumber, expiryDate, cvv }) {
  const normalizedCardholderName = trimString(cardholderName);
  const normalizedCardNumber = trimString(cardNumber);
  const normalizedExpiryDate = trimString(expiryDate);
  const normalizedCvv = trimString(cvv);

  if (!isPositiveIntegerLike(fineId) || !normalizedCardholderName || !normalizedCardNumber || !normalizedExpiryDate || !normalizedCvv) {
    throw createValidationError("Invalid payment payload");
  }

  const [result] = await getPool().query(
    `INSERT INTO payments (fine_id, cardholder_name, card_number, expiry_date, cvv)
     VALUES (?, ?, ?, ?, ?)`,
    [Number(fineId), normalizedCardholderName, normalizedCardNumber, normalizedExpiryDate, normalizedCvv]
  );

  const [rows] = await getPool().query("SELECT * FROM payments WHERE id = ? LIMIT 1", [result.insertId]);
  return rows[0];
}

module.exports = {
  findFineByReference,
  findFineByReferenceWithDetails,
  findPaidFineByReferenceWithDetails,
  createFine,
  listFinesByOfficerId,
  updateFineAsPaid,
  updateFineAsPaidIfUnpaid,
  getDistrictCollectionSummary,
  getCategoryCollectionSummary,
  createPayment
};