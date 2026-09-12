// src/back-end/database/material.database.js
import { pool } from "./mariadb.js";

function normalizeString(v) {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

export async function createMaterial({ image_url, name, description }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const res = await conn.query(
      `
      INSERT INTO materials (image_url, name, description)
      VALUES (?, ?, ?)
      `,
      [String(image_url), String(name).trim(), String(description)]
    );

    return {
      material_id: Number(res.insertId),
      image_url: String(image_url),
      name: String(name).trim(),
      description: String(description)
    };
  } finally {
    if (conn) conn.release();
  }
}

export async function getMaterialById(material_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `
      SELECT material_id, image_url, name, description
      FROM materials
      WHERE material_id = ?
      LIMIT 1
      `,
      [Number(material_id)]
    );
    return rows[0] || null;
  } finally {
    if (conn) conn.release();
  }
}

export async function getMaterialByName(name) {
  let conn;
  try {
    conn = await pool.getConnection();
    const safe = normalizeString(name);
    if (!safe) return null;

    const rows = await conn.query(
      `
      SELECT material_id, image_url, name, description
      FROM materials
      WHERE name = ?
      LIMIT 1
      `,
      [safe]
    );
    return rows[0] || null;
  } finally {
    if (conn) conn.release();
  }
}

export async function updateMaterial(material_id, { image_url, name, description }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const fields = [];
    const params = [];

    if (image_url !== undefined) {
      fields.push("image_url = ?");
      params.push(String(image_url));
    }
    if (name !== undefined) {
      fields.push("name = ?");
      params.push(String(name).trim());
    }
    if (description !== undefined) {
      fields.push("description = ?");
      params.push(String(description));
    }

    if (fields.length === 0) return { affectedRows: 0, message: "No fields to update" };

    params.push(Number(material_id));

    const res = await conn.query(
      `
      UPDATE materials
      SET ${fields.join(", ")}
      WHERE material_id = ?
      `,
      params
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function deleteMaterial(material_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      DELETE FROM materials
      WHERE material_id = ?
      `,
      [Number(material_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function listMaterials({ filters = {}, limit = 20, offset = 0, orderBy = "material_id", orderDir = "DESC" } = {}) {
  let conn;
  try {
    conn = await pool.getConnection();

    const whereClauses = [];
    const params = [];

    const addClause = (field, value) => {
      if (value === undefined || value === null || value === "") return;
      whereClauses.push(`${field} = ?`);
      params.push(value);
    };

    const addLikeClause = (field, value) => {
      if (value === undefined || value === null || value === "") return;
      whereClauses.push(`${field} LIKE ?`);
      params.push(`%${String(value)}%`);
    };

    const f = filters || {};
    addClause("material_id", f.material_id !== undefined ? Number(f.material_id) : undefined);
    addLikeClause("name", f.name);

    const allowedOrderBy = new Set(["material_id", "name"]);
    const safeOrderBy = allowedOrderBy.has(orderBy) ? orderBy : "material_id";
    const safeOrderDir = String(orderDir).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const sql = `
      SELECT material_id, image_url, name, description
      FROM materials
      ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""}
      ORDER BY ${safeOrderBy} ${safeOrderDir}
      LIMIT ? OFFSET ?
    `;

    return await conn.query(sql, [...params, Number(limit ?? 20), Number(offset ?? 0)]);
  } finally {
    if (conn) conn.release();
  }
}

export async function countMaterials({ filters = {} } = {}) {
  let conn;
  try {
    conn = await pool.getConnection();

    const whereClauses = [];
    const params = [];

    const addClause = (field, value) => {
      if (value === undefined || value === null || value === "") return;
      whereClauses.push(`${field} = ?`);
      params.push(value);
    };

    const addLikeClause = (field, value) => {
      if (value === undefined || value === null || value === "") return;
      whereClauses.push(`${field} LIKE ?`);
      params.push(`%${String(value)}%`);
    };

    const f = filters || {};
    addClause("material_id", f.material_id !== undefined ? Number(f.material_id) : undefined);
    addLikeClause("name", f.name);

    const rows = await conn.query(
      `
      SELECT COUNT(*) AS total
      FROM materials
      ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""}
      `,
      params
    );

    return Number(rows?.[0]?.total ?? 0);
  } finally {
    if (conn) conn.release();
  }
}