const { getPool } = require("./db");

function trimString(value) {
  return String(value || "").trim();
}

function normalizeCode(value) {
  return trimString(value).toUpperCase();
}

function parseAmountLkr(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function mapCategory(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    code: row.code,
    title: row.title,
    amountLkr: Number(row.amount_lkr),
    description: row.description || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function findCategoryByCode(code) {
  const [rows] = await getPool().query(
    "SELECT * FROM categories WHERE code = ? LIMIT 1",
    [code]
  );

  return mapCategory(rows[0]);
}

async function listCategories() {
  const [rows] = await getPool().query("SELECT * FROM categories ORDER BY code ASC");
  return rows.map(mapCategory);
}

async function createCategory({ code, title, amountLkr, description }) {
  const normalizedCode = normalizeCode(code);
  const normalizedTitle = trimString(title);
  const parsedAmount = parseAmountLkr(amountLkr);
  const normalizedDescription = trimString(description);

  if (!normalizedCode || !normalizedTitle || parsedAmount === null) {
    throw createValidationError("Invalid category payload");
  }

  const [result] = await getPool().query(
    `INSERT INTO categories (code, title, amount_lkr, description)
     VALUES (?, ?, ?, ?)`,
    [normalizedCode, normalizedTitle, parsedAmount, normalizedDescription || null]
  );

  const [rows] = await getPool().query("SELECT * FROM categories WHERE id = ? LIMIT 1", [result.insertId]);
  return mapCategory(rows[0]);
}

module.exports = {
  findCategoryByCode,
  listCategories,
  createCategory
};
