const { getPool } = require("./db");

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
  const [result] = await getPool().query(
    `INSERT INTO categories (code, title, amount_lkr, description)
     VALUES (?, ?, ?, ?)`,
    [code, title, amountLkr, description || null]
  );

  const [rows] = await getPool().query("SELECT * FROM categories WHERE id = ? LIMIT 1", [result.insertId]);
  return mapCategory(rows[0]);
}

module.exports = {
  findCategoryByCode,
  listCategories,
  createCategory
};
