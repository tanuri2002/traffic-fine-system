const { getPool } = require("./db");

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

async function createFine({ referenceNumber, categoryId, officerId, driverLicenseNo, vehicleNo }) {
  const [result] = await getPool().query(
    `INSERT INTO fines (reference_number, category_id, officer_id, driver_license_no, vehicle_no)
     VALUES (?, ?, ?, ?, ?)`,
    [referenceNumber, categoryId, officerId, driverLicenseNo, vehicleNo]
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
  await getPool().query(
    `UPDATE fines
     SET status = 'PAID', payment_channel = ?, paid_at = NOW()
     WHERE reference_number = ?`,
    [paymentChannel, referenceNumber]
  );

  return findFineByReference(referenceNumber);
}

module.exports = {
  findFineByReference,
  findFineByReferenceWithDetails,
  createFine,
  listFinesByOfficerId,
  updateFineAsPaid
};
