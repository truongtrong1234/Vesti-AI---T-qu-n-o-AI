// src/back-end/database/category.database.js
import { pool } from "./mariadb.js";

function normalizeString(v) {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

export async function createCategory({ code }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const safeCode = normalizeString(code);
    if (!safeCode) throw new Error("CODE_REQUIRED");

    const res = await conn.query(
      `
      INSERT INTO categories (code)
      VALUES (?)
      `,
      [safeCode]
    );

    return {
      category_id: Number(res.insertId),
      code: safeCode
    };
  } finally {
    if (conn) conn.release();
  }
}

export async function getCategoryById(category_id) {
  let conn;
  try {
    conn = await pool.getConnection();

    const rows = await conn.query(
      `
      SELECT category_id, code
      FROM categories
      WHERE category_id = ?
      LIMIT 1
      `,
      [Number(category_id)]
    );

    return rows[0] || null;
  } finally {
    if (conn) conn.release();
  }
}

export async function getCategoryByCode(code) {
  let conn;
  try {
    conn = await pool.getConnection();

    const safeCode = normalizeString(code);
    if (!safeCode) return null;

    const rows = await conn.query(
      `
      SELECT category_id, code
      FROM categories
      WHERE code = ?
      LIMIT 1
      `,
      [safeCode]
    );

    return rows[0] || null;
  } finally {
    if (conn) conn.release();
  }
}

export async function updateCategory(category_id, { code }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const fields = [];
    const params = [];

    if (code !== undefined) {
      fields.push("code = ?");
      params.push(normalizeString(code));
    }

    if (fields.length === 0) return { affectedRows: 0, message: "No fields to update" };

    params.push(Number(category_id));

    const res = await conn.query(
      `
      UPDATE categories
      SET ${fields.join(", ")}
      WHERE category_id = ?
      `,
      params
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function deleteCategory(category_id) {
  let conn;
  try {
    conn = await pool.getConnection();

    const res = await conn.query(
      `
      DELETE FROM categories
      WHERE category_id = ?
      `,
      [Number(category_id)]
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

/**
 * List + filter + pagination
 * filters: { category_id, code }
 * options: { limit=20, offset=0, orderBy="category_id", orderDir="DESC" }
 */
export async function listCategories({
  filters = {},
  limit = 20,
  offset = 0,
  orderBy = "category_id",
  orderDir = "DESC"
} = {}) {
  let conn;
  try {
    conn = await pool.getConnection();

    const whereClauses = [];
    const params = [];

    const addClause = (field, value, operator = "=") => {
      if (value === undefined || value === null || value === "") return;
      whereClauses.push(`${field} ${operator} ?`);
      params.push(value);
    };

    const addLikeClause = (field, value) => {
      if (value === undefined || value === null || value === "") return;
      whereClauses.push(`${field} LIKE ?`);
      params.push(`%${String(value)}%`);
    };

    const f = filters || {};
    addClause("category_id", f.category_id !== undefined ? Number(f.category_id) : undefined);
    addLikeClause("code", f.code);

    const allowedOrderBy = new Set(["category_id", "code"]);
    const safeOrderBy = allowedOrderBy.has(orderBy) ? orderBy : "category_id";
    const safeOrderDir = String(orderDir).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const sql = `
      SELECT category_id, code
      FROM categories
      ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""}
      ORDER BY ${safeOrderBy} ${safeOrderDir}
      LIMIT ? OFFSET ?
    `;

    const rows = await conn.query(sql, [...params, Number(limit ?? 20), Number(offset ?? 0)]);
    return rows;
  } finally {
    if (conn) conn.release();
  }
}

export async function countCategories({ filters = {} } = {}) {
  let conn;
  try {
    conn = await pool.getConnection();

    const whereClauses = [];
    const params = [];

    const addClause = (field, value, operator = "=") => {
      if (value === undefined || value === null || value === "") return;
      whereClauses.push(`${field} ${operator} ?`);
      params.push(value);
    };

    const addLikeClause = (field, value) => {
      if (value === undefined || value === null || value === "") return;
      whereClauses.push(`${field} LIKE ?`);
      params.push(`%${String(value)}%`);
    };

    const f = filters || {};
    addClause("category_id", f.category_id !== undefined ? Number(f.category_id) : undefined);
    addLikeClause("code", f.code);

    const rows = await conn.query(
      `
      SELECT COUNT(*) AS total
      FROM categories
      ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""}
      `,
      params
    );

    return Number(rows?.[0]?.total ?? 0);
  } finally {
    if (conn) conn.release();
  }
}