// src/back-end/database/outfitItems.database.js
import { pool } from "./mariadb.js";

export async function upsertOutfitItem({ outfit_id, item_id, role = null, position = null }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const safeRole = role === undefined ? null : role;
    const safePosition =
      position === undefined || position === null || position === ""
        ? null
        : Number(position);

    const res = await conn.query(
      `
      INSERT INTO outfit_items (outfit_id, item_id, role, position)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE role = VALUES(role), position = VALUES(position)
      `,
      [Number(outfit_id), Number(item_id), safeRole, safePosition]
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function removeOutfitItem({ outfit_id, item_id }) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      DELETE FROM outfit_items
      WHERE outfit_id = ? AND item_id = ?
      `,
      [Number(outfit_id), Number(item_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function listItemsByOutfitId(outfit_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `
      SELECT outfit_id, item_id, role, position
      FROM outfit_items
      WHERE outfit_id = ?
      ORDER BY position ASC, item_id DESC
      `,
      [Number(outfit_id)]
    );
  } finally {
    if (conn) conn.release();
  }
}