// src/back-end/database/itemEvents.database.js
import { pool } from "./mariadb.js";

export async function addItemEvent({ item_id, event_id }) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      INSERT IGNORE INTO item_events (item_id, event_id)
      VALUES (?, ?)
      `,
      [Number(item_id), Number(event_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function removeItemEvent({ item_id, event_id }) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `
      DELETE FROM item_events
      WHERE item_id = ? AND event_id = ?
      `,
      [Number(item_id), Number(event_id)]
    );
    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function listEventsByItemId(item_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `
      SELECT item_id, event_id
      FROM item_events
      WHERE item_id = ?
      ORDER BY event_id DESC
      `,
      [Number(item_id)]
    );
  } finally {
    if (conn) conn.release();
  }
}

export async function listItemsByEventId(event_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `
      SELECT item_id, event_id
      FROM item_events
      WHERE event_id = ?
      ORDER BY item_id DESC
      `,
      [Number(event_id)]
    );
  } finally {
    if (conn) conn.release();
  }
}