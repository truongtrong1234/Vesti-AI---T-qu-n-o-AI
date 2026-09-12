// src/back-end/database/packageItems.database.js
import { pool } from "./mariadb.js";

export async function upsertPackageItem({ package_id, item_id, quantity = 1, is_packed = 0 }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const qty = quantity === undefined || quantity === null ? 1 : Number(quantity);
    const packed = Number(is_packed) ? 1 : 0;

    const res = await conn.query(
      `
      INSERT INTO package_items (package_id, item_id, quantity, is_packed)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), is_packed = VALUES(is_packed)
      `,
      [Number(package_id), Number(item_id), qty, packed]
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function removePackageItem({ package_id, item_id }) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      DELETE FROM package_items
      WHERE package_id = ? AND item_id = ?
      `,
      [Number(package_id), Number(item_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function listItemsByPackageId(package_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `
      SELECT package_id, item_id, quantity, is_packed
      FROM package_items
      WHERE package_id = ?
      ORDER BY item_id DESC
      `,
      [Number(package_id)]
    );
  } finally {
    if (conn) conn.release();
  }
}