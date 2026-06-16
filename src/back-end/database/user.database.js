import { pool } from "./mariadb.js";

export async function createUser({
  email,
  password,
  name = null,
  phone_number = null,
  age = null,
  gender = null,
  dateofbirth = null,
  job = null
}) {
  let conn;
  try {
    conn = await pool.getConnection();

    const res = await conn.query(
      `
      INSERT INTO users (email, password, name, phone_number, age, gender, dateofbirth, job)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [email, password, name, phone_number, age, gender, dateofbirth, job]
    );

    return {
      user_id: Number(res.insertId),
      email,
      name,
      phone_number,
      age,
      gender,
      dateofbirth,
      job
    };
  } finally {
    if (conn) conn.release();
  }
}

export async function updateUser(
  user_id,
  { email, name, phone_number, age, gender, dateofbirth, job }
) {
  let conn;
  try {
    conn = await pool.getConnection();

    const fields = [];
    const params = [];

    if (email !== undefined) {
      fields.push("email = ?");
      params.push(email);
    }
    if (name !== undefined) {
      fields.push("name = ?");
      params.push(name);
    }
    if (phone_number !== undefined) {
      fields.push("phone_number = ?");
      params.push(phone_number);
    }
    if (age !== undefined) {
      fields.push("age = ?");
      params.push(age);
    }
    if (gender !== undefined) {
      fields.push("gender = ?");
      params.push(gender);
    }
    if (dateofbirth !== undefined) {
      fields.push("dateofbirth = ?");
      params.push(dateofbirth);
    }
    if (job !== undefined) {
      fields.push("job = ?");
      params.push(job);
    }

    if (fields.length === 0) {
      return { affectedRows: 0, message: "No fields to update" };
    }

    params.push(user_id);

    const res = await conn.query(
      `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE user_id = ?
      `,
      params
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function changePassword(user_id, new_password) {
  let conn;
  try {
    conn = await pool.getConnection();

    const res = await conn.query(
      `
      UPDATE users
      SET password = ?
      WHERE user_id = ?
      `,
      [new_password, user_id]
    );

    return { affectedRows: res.affectedRows };
  } finally {
    if (conn) conn.release();
  }
}

export async function getUserById(user_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `
      SELECT user_id, email, name, phone_number, age, gender, dateofbirth, job, created_at
      FROM users
      WHERE user_id = ?
      LIMIT 1
      `,
      [user_id]
    );
    return rows[0] || null;
  } finally {
    if (conn) conn.release();
  }
}

export async function searchUserByName(name, { limit = 20, offset = 0 } = {}) {
  let conn;
  try {
    conn = await pool.getConnection();

    const keyword = `%${name}%`;

    const rows = await conn.query(
      `
      SELECT user_id, email, name, phone_number, age, gender, dateofbirth, job, created_at
      FROM users
      WHERE name LIKE ?
      ORDER BY user_id DESC
      LIMIT ? OFFSET ?
      `,
      [keyword, Number(limit), Number(offset)]
    );

    return rows;
  } finally {
    if (conn) conn.release();
  }
}