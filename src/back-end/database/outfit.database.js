// src/back-end/database/outfit.database.js
import { pool } from "./mariadb.js";

function toDateOnly(value) {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) {
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, "0");
    const dd = String(value.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  if (typeof value === "string") return value;
  return null;
}

function normalizeString(v) {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

export async function createOutfit({ user_id, worn_date, style_id, note = null }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const res = await conn.query(
      `
      INSERT INTO outfits (user_id, worn_date, style_id, note)
      VALUES (?, ?, ?, ?)
      `,
      [Number(user_id), toDateOnly(worn_date), Number(style_id), normalizeString(note)]
    );

    return {
      outfit_id: Number(res.insertId),
      user_id: Number(user_id),
      worn_date: toDateOnly(worn_date),
      style_id: Number(style_id),
      note: normalizeString(note)
    };
  } finally {
    if (conn) conn.release();
  }
}

export async function getOutfitById(outfit_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `
      SELECT outfit_id, user_id, worn_date, style_id, note, created_at
      FROM outfits
      WHERE outfit_id = ?
      LIMIT 1
      `,
      [Number(outfit_id)]
    );
    return rows[0] || null;
  } finally {
    if (conn) conn.release();
  }
}

export async function updateOutfit(outfit_id, { worn_date, style_id, note }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const fields = [];
    const params = [];

    if (worn_date !== undefined) {
      fields.push("worn_date = ?");
      params.push(toDateOnly(worn_date));
    }
    if (style_id !== undefined) {
      fields.push("style_id = ?");
      params.push(Number(style_id));
    }
    if (note !== undefined) {
      fields.push("note = ?");
      params.push(normalizeString(note));
    }

    if (!fields.length) return { affectedRows: 0, message: "No fields to update" };

    params.push(Number(outfit_id));

    const res = await conn.query(
      `
      UPDATE outfits
      SET ${fields.join(", ")}
      WHERE outfit_id = ?
      `,
      params
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function deleteOutfit(outfit_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      DELETE FROM outfits
      WHERE outfit_id = ?
      `,
      [Number(outfit_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function listOutfits({ filters = {}, limit = 20, offset = 0, orderBy = "outfit_id", orderDir = "DESC" } = {}) {
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

    const f = filters || {};
    addClause("outfit_id", f.outfit_id !== undefined ? Number(f.outfit_id) : undefined);
    addClause("user_id", f.user_id !== undefined ? Number(f.user_id) : undefined);
    addClause("style_id", f.style_id !== undefined ? Number(f.style_id) : undefined);
    addClause("worn_date", f.worn_date ? toDateOnly(f.worn_date) : f.worn_date);

    const allowedOrderBy = new Set(["outfit_id", "worn_date", "created_at"]);
    const safeOrderBy = allowedOrderBy.has(orderBy) ? orderBy : "outfit_id";
    const safeOrderDir = String(orderDir).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const sql = `
      SELECT outfit_id, user_id, worn_date, style_id, note, created_at
      FROM outfits
      ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""}
      ORDER BY ${safeOrderBy} ${safeOrderDir}
      LIMIT ? OFFSET ?
    `;

    return await conn.query(sql, [...params, Number(limit ?? 20), Number(offset ?? 0)]);
  } finally {
    if (conn) conn.release();
  }
}

export async function countOutfits({ filters = {} } = {}) {
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

    const f = filters || {};
    addClause("outfit_id", f.outfit_id !== undefined ? Number(f.outfit_id) : undefined);
    addClause("user_id", f.user_id !== undefined ? Number(f.user_id) : undefined);
    addClause("style_id", f.style_id !== undefined ? Number(f.style_id) : undefined);
    addClause("worn_date", f.worn_date ? toDateOnly(f.worn_date) : f.worn_date);

    const rows = await conn.query(
      `
      SELECT COUNT(*) AS total
      FROM outfits
      ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""}
      `,
      params
    );

    return Number(rows?.[0]?.total ?? 0);
  } finally {
    if (conn) conn.release();
  }
}