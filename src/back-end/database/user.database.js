import { pool } from "./mariadb.js";

function toDateOnly(value) {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) {
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, "0");
    const dd = String(value.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  if (typeof value === "string") return value; // expecting YYYY-MM-DD
  return null;
}

export async function createUser({
  email,
  password,
  name = null,
  phone_number = null,
  age = null,
  gender = null,
  dateofbirth = null,
  job = null,
  picture_url = null
}) {
  let conn;
  try {
    conn = await pool.getConnection();

    const res = await conn.query(
      `
      INSERT INTO users (email, password, name, phone_number, age, gender, dateofbirth, job, picture_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        email,
        password,
        name,
        phone_number,
        age,
        gender,
        toDateOnly(dateofbirth),
        job,
        picture_url
      ]
    );

    return {
      user_id: Number(res.insertId),
      email,
      name,
      phone_number,
      age,
      gender,
      dateofbirth: toDateOnly(dateofbirth),
      job,
      picture_url
    };
  } finally {
    if (conn) conn.release();
  }
}

export async function updateUser(
  user_id,
  { email, name, phone_number, age, gender, dateofbirth, job, picture_url }
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
      params.push(toDateOnly(dateofbirth));
    }
    if (job !== undefined) {
      fields.push("job = ?");
      params.push(job);
    }
    if (picture_url !== undefined) {
      fields.push("picture_url = ?");
      params.push(picture_url);
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
      SELECT user_id, email, name, phone_number, age, gender, dateofbirth, job, picture_url, created_at
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
      SELECT user_id, email, name, phone_number, age, gender, dateofbirth, job, picture_url, created_at
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
export async function getUserByEmail(email) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `
      SELECT user_id, email, name, phone_number, age, gender, dateofbirth, job, picture_url, created_at
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );
    return rows[0] || null;
  } finally {
    if (conn) conn.release();
  }
}

export async function getUserToLogin(email) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `
      SELECT user_id, email, password, name, phone_number, age, gender, dateofbirth, job, picture_url, created_at
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );
    return rows[0] || null;
  } finally {
    if (conn) conn.release();
  }
}
