// src/back-end/database/itemMaterials.database.js
import { pool } from "./mariadb.js";

export async function upsertItemMaterial({ item_id, material_id, percentage = null }) {
  let conn;
  try {
    conn = await pool.getConnection();

    const pct =
      percentage === undefined || percentage === null || percentage === ""
        ? null
        : Number(percentage);

    const res = await conn.query(
      `
      INSERT INTO item_materials (item_id, material_id, percentage)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE percentage = VALUES(percentage)
      `,
      [Number(item_id), Number(material_id), pct]
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function removeItemMaterial({ item_id, material_id }) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      DELETE FROM item_materials
      WHERE item_id = ? AND material_id = ?
      `,
      [Number(item_id), Number(material_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function listMaterialsByItemId(item_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `
      SELECT item_id, material_id, percentage
      FROM item_materials
      WHERE item_id = ?
      ORDER BY material_id DESC
      `,
      [Number(item_id)]
    );
  } finally {
    if (conn) conn.release();
  }
}

export async function listItemsByMaterialId(material_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `
      SELECT item_id, material_id, percentage
      FROM item_materials
      WHERE material_id = ?
      ORDER BY item_id DESC
      `,
      [Number(material_id)]
    );
  } finally {
    if (conn) conn.release();
  }
}