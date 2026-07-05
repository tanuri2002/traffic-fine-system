const { getPool } = require("./db");

function mapOfficer(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    badgeNumber: row.badge_number,
    name: row.name,
    phone: row.phone,
    district: row.district,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function findOfficerByBadgeNumber(badgeNumber) {
  const [rows] = await getPool().query(
    "SELECT * FROM officers WHERE badge_number = ? LIMIT 1",
    [badgeNumber]
  );

  return mapOfficer(rows[0]);
}

async function findOfficerById(id) {
  const [rows] = await getPool().query(
    "SELECT * FROM officers WHERE id = ? LIMIT 1",
    [id]
  );

  return mapOfficer(rows[0]);
}

async function createOfficer({ badgeNumber, name, phone, district, passwordHash, role }) {
  const [result] = await getPool().query(
    `INSERT INTO officers (badge_number, name, phone, district, password_hash, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [badgeNumber, name, phone, district, passwordHash, role]
  );

  return findOfficerById(result.insertId);
}

module.exports = {
  findOfficerByBadgeNumber,
  findOfficerById,
  createOfficer
};
