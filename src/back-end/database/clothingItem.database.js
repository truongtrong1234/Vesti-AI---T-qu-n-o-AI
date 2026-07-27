import { pool } from "./mariadb.js";

function normalizeString(v) {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

export async function createClothingItem({
  user_id,
  name,
  category_id,
  brand = null,
  color = null,
  size_id = null,
  image_url = null,
  notes = null,
  is_active = 1
}) {
  let conn;
  try {
    conn = await pool.getConnection();

    const res = await conn.query(
      `
      INSERT INTO clothing_items
        (user_id, name, category_id, brand, color, size_id, image_url, notes, is_active)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        Number(user_id),
        String(name),
        Number(category_id),
        normalizeString(brand),
        normalizeString(color),
        size_id === undefined ? null : size_id === null ? null : Number(size_id),
        image_url === undefined ? null : image_url === null ? null : String(image_url),
        notes === undefined ? null : notes === null ? null : String(notes),
        is_active === undefined || is_active === null ? 1 : Number(is_active) ? 1 : 0
      ]
    );

    return {
      item_id: Number(res.insertId),
      user_id: Number(user_id),
      name: String(name),
      category_id: Number(category_id),
      brand: normalizeString(brand),
      color: normalizeString(color),
      size_id: size_id === undefined ? null : size_id === null ? null : Number(size_id),
      image_url: image_url === undefined ? null : image_url === null ? null : String(image_url),
      notes: notes === undefined ? null : notes === null ? null : String(notes),
      is_active: is_active === undefined || is_active === null ? 1 : Number(is_active) ? 1 : 0
    };
  } finally {
    if (conn) conn.release();
  }
}

export async function getClothingItemById(item_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `
      SELECT
        item_id, user_id, name, category_id, brand, color, size_id,
        image_url, notes, is_active, created_at, updated_at
      FROM clothing_items
      WHERE item_id = ?
      LIMIT 1
      `,
      [Number(item_id)]
    );
    return rows[0] || null;
  } finally {
    if (conn) conn.release();
  }
}

export async function updateClothingItem(
  item_id,
  { user_id, name, category_id, brand, color, size_id, image_url, notes, is_active }
) {
  let conn;
  try {
    conn = await pool.getConnection();

    const fields = [];
    const params = [];

    if (user_id !== undefined) {
      fields.push("user_id = ?");
      params.push(Number(user_id));
    }
    if (name !== undefined) {
      fields.push("name = ?");
      params.push(String(name));
    }
    if (category_id !== undefined) {
      fields.push("category_id = ?");
      params.push(Number(category_id));
    }
    if (brand !== undefined) {
      fields.push("brand = ?");
      params.push(normalizeString(brand));
    }
    if (color !== undefined) {
      fields.push("color = ?");
      params.push(normalizeString(color));
    }
    if (size_id !== undefined) {
      fields.push("size_id = ?");
      params.push(size_id === null ? null : Number(size_id));
    }
    if (image_url !== undefined) {
      fields.push("image_url = ?");
      params.push(image_url === null ? null : String(image_url));
    }
    if (notes !== undefined) {
      fields.push("notes = ?");
      params.push(notes === null ? null : String(notes));
    }
    if (is_active !== undefined) {
      fields.push("is_active = ?");
      params.push(Number(is_active) ? 1 : 0);
    }

    if (fields.length === 0) {
      return { affectedRows: 0, message: "No fields to update" };
    }

    params.push(Number(item_id));

    const res = await conn.query(
      `
      UPDATE clothing_items
      SET ${fields.join(", ")}
      WHERE item_id = ?
      `,
      params
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function deleteClothingItem(item_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      DELETE FROM clothing_items
      WHERE item_id = ?
      `,
      [Number(item_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

/**
 * List + filter + pagination
 * filters hỗ trợ:
 * - item_id, user_id, category_id, size_id, is_active
 * - name (LIKE), brand (LIKE), color (LIKE)
 *
 * options: { limit=20, offset=0, orderBy="item_id", orderDir="DESC" }
 */
export async function listClothingItems({ filters = {}, limit = 20, offset = 0, orderBy = "item_id", orderDir = "DESC" } = {}) {
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

    addClause("item_id", f.item_id !== undefined ? Number(f.item_id) : undefined);
    addClause("user_id", f.user_id !== undefined ? Number(f.user_id) : undefined);
    addClause("category_id", f.category_id !== undefined ? Number(f.category_id) : undefined);
    addClause("size_id", f.size_id !== undefined && f.size_id !== null && f.size_id !== "" ? Number(f.size_id) : f.size_id === null ? null : undefined);
    addClause("is_active", f.is_active !== undefined ? (Number(f.is_active) ? 1 : 0) : undefined);

    addLikeClause("name", f.name);
    addLikeClause("brand", f.brand);
    addLikeClause("color", f.color);

    const allowedOrderBy = new Set(["item_id", "created_at", "updated_at", "name"]);
    const safeOrderBy = allowedOrderBy.has(orderBy) ? orderBy : "item_id";
    const safeOrderDir = String(orderDir).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const sql = `
      SELECT
        item_id, user_id, name, category_id, brand, color, size_id,
        image_url, notes, is_active, created_at, updated_at
      FROM clothing_items
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

/**
 * Optional: trả về total để làm pagination (nếu bạn cần)
 */
export async function countClothingItems({ filters = {} } = {}) {
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

    addClause("item_id", f.item_id !== undefined ? Number(f.item_id) : undefined);
    addClause("user_id", f.user_id !== undefined ? Number(f.user_id) : undefined);
    addClause("category_id", f.category_id !== undefined ? Number(f.category_id) : undefined);
    addClause("size_id", f.size_id !== undefined && f.size_id !== null && f.size_id !== "" ? Number(f.size_id) : f.size_id === null ? null : undefined);
    addClause("is_active", f.is_active !== undefined ? (Number(f.is_active) ? 1 : 0) : undefined);

    addLikeClause("name", f.name);
    addLikeClause("brand", f.brand);
    addLikeClause("color", f.color);

    const rows = await conn.query(
      `
      SELECT COUNT(*) AS total
      FROM clothing_items
      ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""}
      `,
      params
    );

    return Number(rows?.[0]?.total ?? 0);
  } finally {
    if (conn) conn.release();
  }
}