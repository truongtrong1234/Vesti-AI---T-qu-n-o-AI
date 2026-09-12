// src/back-end/database/packageOutfits.database.js
import { pool } from "./mariadb.js";

export async function addPackageOutfit({ package_id, outfit_id }) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      INSERT IGNORE INTO package_outfits (package_id, outfit_id)
      VALUES (?, ?)
      `,
      [Number(package_id), Number(outfit_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function removePackageOutfit({ package_id, outfit_id }) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      DELETE FROM package_outfits
      WHERE package_id = ? AND outfit_id = ?
      `,
      [Number(package_id), Number(outfit_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function listOutfitsByPackageId(package_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `
      SELECT package_id, outfit_id, added_at
      FROM package_outfits
      WHERE package_id = ?
      ORDER BY added_at DESC
      `,
      [Number(package_id)]
    );
  } finally {
    if (conn) conn.release();
  }
}