const { getPool } = require("./db");

function trimString(value) {
  return String(value || "").trim();
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

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

function mapOfficerRegistry(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    badgeNumber: row.badge_number,
    name: row.name,
    phone: row.phone,
    district: row.district,
    active: Boolean(row.active),
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

async function findOfficerRegistryByBadgeNumber(badgeNumber) {
  const [rows] = await getPool().query(
    "SELECT * FROM officer_registry WHERE badge_number = ? AND active = 1 LIMIT 1",
    [badgeNumber]
  );

  return mapOfficerRegistry(rows[0]);
}

async function createOfficer({ badgeNumber, name, phone, district, passwordHash, role }) {
  const normalizedBadgeNumber = trimString(badgeNumber);
  const normalizedName = trimString(name);
  const normalizedPhone = trimString(phone);
  const normalizedDistrict = trimString(district);
  const normalizedRole = trimString(role);

  if (!normalizedBadgeNumber || !normalizedName || !normalizedPhone || !normalizedDistrict || !passwordHash) {
    throw createValidationError("Invalid officer payload");
  }

  if (normalizedRole !== "officer" && normalizedRole !== "admin") {
    throw createValidationError("Invalid officer role");
  }

  const [result] = await getPool().query(
    `INSERT INTO officers (badge_number, name, phone, district, password_hash, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [normalizedBadgeNumber, normalizedName, normalizedPhone, normalizedDistrict, passwordHash, normalizedRole]
  );

  return findOfficerById(result.insertId);
}

async function listOfficerRegistry() {
  const [rows] = await getPool().query("SELECT * FROM officer_registry ORDER BY id DESC");
  return rows.map(mapOfficerRegistry);
}

async function findOfficerRegistryById(id) {
  const [rows] = await getPool().query(
    "SELECT * FROM officer_registry WHERE id = ? LIMIT 1",
    [id]
  );
  return mapOfficerRegistry(rows[0]);
}

async function createOfficerRegistry({ badgeNumber, name, phone, district, active }) {
  const normalizedBadgeNumber = trimString(badgeNumber);
  const normalizedName = trimString(name);
  const normalizedPhone = trimString(phone);
  const normalizedDistrict = trimString(district);
  const isActive = active === undefined || active === null ? 1 : (active ? 1 : 0);

  if (!normalizedBadgeNumber || !normalizedName || !normalizedPhone || !normalizedDistrict) {
    throw createValidationError("badgeNumber, name, phone, and district are required");
  }

  const [existingRows] = await getPool().query(
    "SELECT id FROM officer_registry WHERE badge_number = ? LIMIT 1",
    [normalizedBadgeNumber]
  );
  if (existingRows.length > 0) {
    const conflictErr = new Error("Officer with this badge number already exists in registry");
    conflictErr.statusCode = 409;
    throw conflictErr;
  }

  const [result] = await getPool().query(
    `INSERT INTO officer_registry (badge_number, name, phone, district, active)
     VALUES (?, ?, ?, ?, ?)`,
    [normalizedBadgeNumber, normalizedName, normalizedPhone, normalizedDistrict, isActive]
  );

  return findOfficerRegistryById(result.insertId);
}

async function updateOfficerRegistry(id, { badgeNumber, name, phone, district, active }) {
  const existing = await findOfficerRegistryById(id);
  if (!existing) {
    const error = new Error("Officer registry entry not found");
    error.statusCode = 404;
    throw error;
  }

  const normalizedBadgeNumber = badgeNumber !== undefined ? trimString(badgeNumber) : existing.badgeNumber;
  const normalizedName = name !== undefined ? trimString(name) : existing.name;
  const normalizedPhone = phone !== undefined ? trimString(phone) : existing.phone;
  const normalizedDistrict = district !== undefined ? trimString(district) : existing.district;
  const isActive = active !== undefined && active !== null ? (active ? 1 : 0) : (existing.active ? 1 : 0);

  if (!normalizedBadgeNumber || !normalizedName || !normalizedPhone || !normalizedDistrict) {
    throw createValidationError("badgeNumber, name, phone, and district cannot be empty");
  }

  if (badgeNumber !== undefined && normalizedBadgeNumber !== existing.badgeNumber) {
    const [existingRows] = await getPool().query(
      "SELECT id FROM officer_registry WHERE badge_number = ? AND id != ? LIMIT 1",
      [normalizedBadgeNumber, id]
    );
    if (existingRows.length > 0) {
      const conflictErr = new Error("Officer with this badge number already exists in registry");
      conflictErr.statusCode = 409;
      throw conflictErr;
    }
  }

  await getPool().query(
    `UPDATE officer_registry
     SET badge_number = ?, name = ?, phone = ?, district = ?, active = ?
     WHERE id = ?`,
    [normalizedBadgeNumber, normalizedName, normalizedPhone, normalizedDistrict, isActive, id]
  );

  return findOfficerRegistryById(id);
}

async function deleteOfficerRegistry(id) {
  const existing = await findOfficerRegistryById(id);
  if (!existing) {
    const error = new Error("Officer registry entry not found");
    error.statusCode = 404;
    throw error;
  }

  await getPool().query("DELETE FROM officer_registry WHERE id = ?", [id]);
  return true;
}

module.exports = {
  findOfficerByBadgeNumber,
  findOfficerById,
  createOfficer,
  findOfficerRegistryByBadgeNumber,
  listOfficerRegistry,
  findOfficerRegistryById,
  createOfficerRegistry,
  updateOfficerRegistry,
  deleteOfficerRegistry
};

