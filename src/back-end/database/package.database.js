// src/back-end/database/package.database.js
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

export async function createPackage({ user_id, name, description = null, start_date = null, end_date = null }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const res = await conn.query(
      `
      INSERT INTO packages (user_id, name, description, start_date, end_date)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        Number(user_id),
        String(name).trim(),
        normalizeString(description),
        toDateOnly(start_date),
        toDateOnly(end_date)
      ]
    );

    return {
      package_id: Number(res.insertId),
      user_id: Number(user_id),
      name: String(name).trim(),
      description: normalizeString(description),
      start_date: toDateOnly(start_date),
      end_date: toDateOnly(end_date)
    };
  } finally {
    if (conn) conn.release();
  }
}

export async function getPackageById(package_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `
      SELECT package_id, user_id, name, description, start_date, end_date, created_at
      FROM packages
      WHERE package_id = ?
      LIMIT 1
      `,
      [Number(package_id)]
    );
    return rows[0] || null;
  } finally {
    if (conn) conn.release();
  }
}

export async function updatePackage(package_id, { name, description, start_date, end_date }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const fields = [];
    const params = [];

    if (name !== undefined) {
      fields.push("name = ?");
      params.push(String(name).trim());
    }
    if (description !== undefined) {
      fields.push("description = ?");
      params.push(normalizeString(description));
    }
    if (start_date !== undefined) {
      fields.push("start_date = ?");
      params.push(toDateOnly(start_date));
    }
    if (end_date !== undefined) {
      fields.push("end_date = ?");
      params.push(toDateOnly(end_date));
    }

    if (!fields.length) return { affectedRows: 0, message: "No fields to update" };

    params.push(Number(package_id));

    const res = await conn.query(
      `
      UPDATE packages
      SET ${fields.join(", ")}
      WHERE package_id = ?
      `,
      params
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function deletePackage(package_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      DELETE FROM packages
      WHERE package_id = ?
      `,
      [Number(package_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function listPackages({ filters = {}, limit = 20, offset = 0, orderBy = "package_id", orderDir = "DESC" } = {}) {
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
    addClause("package_id", f.package_id !== undefined ? Number(f.package_id) : undefined);
    addClause("user_id", f.user_id !== undefined ? Number(f.user_id) : undefined);
    addLikeClause("name", f.name);

    const allowedOrderBy = new Set(["package_id", "created_at", "name"]);
    const safeOrderBy = allowedOrderBy.has(orderBy) ? orderBy : "package_id";
    const safeOrderDir = String(orderDir).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const sql = `
      SELECT package_id, user_id, name, description, start_date, end_date, created_at
      FROM packages
      ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""}
      ORDER BY ${safeOrderBy} ${safeOrderDir}
      LIMIT ? OFFSET ?
    `;

    return await conn.query(sql, [...params, Number(limit ?? 20), Number(offset ?? 0)]);
  } finally {
    if (conn) conn.release();
  }
}

export async function countPackages({ filters = {} } = {}) {
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
    addClause("package_id", f.package_id !== undefined ? Number(f.package_id) : undefined);
    addClause("user_id", f.user_id !== undefined ? Number(f.user_id) : undefined);
    addLikeClause("name", f.name);

    const rows = await conn.query(
      `
      SELECT COUNT(*) AS total
      FROM packages
      ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""}
      `,
      params
    );

    return Number(rows?.[0]?.total ?? 0);
  } finally {
    if (conn) conn.release();
  }
}