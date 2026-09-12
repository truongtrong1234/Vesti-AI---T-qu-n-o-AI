// src/back-end/database/itemSeasons.database.js
import { pool } from "./mariadb.js";

export async function addItemSeason({ item_id, season_id }) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      INSERT IGNORE INTO item_seasons (item_id, season_id)
      VALUES (?, ?)
      `,
      [Number(item_id), Number(season_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function removeItemSeason({ item_id, season_id }) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      DELETE FROM item_seasons
      WHERE item_id = ? AND season_id = ?
      `,
      [Number(item_id), Number(season_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function listSeasonsByItemId(item_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `
      SELECT item_id, season_id
      FROM item_seasons
      WHERE item_id = ?
      ORDER BY season_id DESC
      `,
      [Number(item_id)]
    );
  } finally {
    if (conn) conn.release();
  }
}

export async function listItemsBySeasonId(season_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `
      SELECT item_id, season_id
      FROM item_seasons
      WHERE season_id = ?
      ORDER BY item_id DESC
      `,
      [Number(season_id)]
    );
  } finally {
    if (conn) conn.release();
  }
}