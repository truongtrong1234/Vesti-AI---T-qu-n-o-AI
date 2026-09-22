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

// Convert toàn bộ BigInt trong kết quả query sang Number (hoặc string nếu bạn muốn an toàn tuyệt đối).
// Ở đây mình dùng Number, giả sử id của bạn không vượt quá Number.MAX_SAFE_INTEGER.
function normalizeRow(row) {
  if (!row || typeof row !== "object") return row;
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    if (typeof value === "bigint") {
      out[key] = Number(value); // hoặc String(value)
    } else {
      out[key] = value;
    }
  }
  return out;
}

function normalizeRows(rows) {
  if (!Array.isArray(rows)) return rows;
  return rows.map(normalizeRow);
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
  picture_url = null,

  height_cm = null,
  weight_kg = null,
  bust_cm = null,
  waist_cm = null,
  hip_cm = null,
  favorite_style = null,
  preferred_color_tone = null,
  body_shape = null,
  usual_size = null,
  fashion_budget_min = null,
  fashion_budget_max = null
}) {
  let conn;
  try {
    conn = await pool.getConnection();

    const hasBudgetMin = fashion_budget_min !== null && fashion_budget_min !== undefined;
    const hasBudgetMax = fashion_budget_max !== null && fashion_budget_max !== undefined;

    if (hasBudgetMin !== hasBudgetMax) {
      throw new Error("BUDGET_MIN_MAX_MUST_BE_BOTH_NULL_OR_BOTH_SET");
    }

    const columns = [
      "email", "password", "name", "phone_number", "age", "gender", "dateofbirth", "job", "picture_url",
      "height_cm", "weight_kg", "bust_cm", "waist_cm", "hip_cm",
      "favorite_style", "preferred_color_tone", "body_shape", "usual_size"
    ];

    const params = [
      email,
      password,
      name,
      phone_number,
      age,
      gender,
      toDateOnly(dateofbirth),
      job,
      picture_url,

      height_cm === null || height_cm === undefined ? null : Number(height_cm),
      weight_kg === null || weight_kg === undefined ? null : Number(weight_kg),
      bust_cm === null || bust_cm === undefined ? null : Number(bust_cm),
      waist_cm === null || waist_cm === undefined ? null : Number(waist_cm),
      hip_cm === null || hip_cm === undefined ? null : Number(hip_cm),

      favorite_style,
      preferred_color_tone,
      body_shape,
      usual_size
    ];

    if (hasBudgetMin && hasBudgetMax) {
      columns.push("fashion_budget_min", "fashion_budget_max");
      params.push(Number(fashion_budget_min), Number(fashion_budget_max));
    }

    const placeholders = columns.map(() => "?").join(", ");

    const res = await conn.query(
      `
      INSERT INTO users (${columns.join(", ")})
      VALUES (${placeholders})
      `,
      params
    );

    // insertId từ mariadb có thể là BigInt -> ép sang Number luôn tại đây
    const user_id = Number(res.insertId);

    return {
      user_id,
      email,
      name,
      phone_number,
      age,
      gender,
      dateofbirth: toDateOnly(dateofbirth),
      job,
      picture_url,

      height_cm: height_cm === null || height_cm === undefined ? null : Number(height_cm),
      weight_kg: weight_kg === null || weight_kg === undefined ? null : Number(weight_kg),
      bust_cm: bust_cm === null || bust_cm === undefined ? null : Number(bust_cm),
      waist_cm: waist_cm === null || waist_cm === undefined ? null : Number(waist_cm),
      hip_cm: hip_cm === null || hip_cm === undefined ? null : Number(hip_cm),
      favorite_style,
      preferred_color_tone,
      body_shape,
      usual_size,
      fashion_budget_min: hasBudgetMin ? Number(fashion_budget_min) : null,
      fashion_budget_max: hasBudgetMax ? Number(fashion_budget_max) : null
    };
  } finally {
    if (conn) conn.release();
  }
}

export async function updateUser(
  user_id,
  {
    email,
    name,
    phone_number,
    age,
    gender,
    dateofbirth,
    job,
    picture_url,

    height_cm,
    weight_kg,
    bust_cm,
    waist_cm,
    hip_cm,
    favorite_style,
    preferred_color_tone,
    body_shape,
    usual_size,
    fashion_budget_min,
    fashion_budget_max
  }
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

    // profile fields
    if (height_cm !== undefined) {
      fields.push("height_cm = ?");
      params.push(height_cm === null ? null : Number(height_cm));
    }
    if (weight_kg !== undefined) {
      fields.push("weight_kg = ?");
      params.push(weight_kg === null ? null : Number(weight_kg));
    }
    if (bust_cm !== undefined) {
      fields.push("bust_cm = ?");
      params.push(bust_cm === null ? null : Number(bust_cm));
    }
    if (waist_cm !== undefined) {
      fields.push("waist_cm = ?");
      params.push(waist_cm === null ? null : Number(waist_cm));
    }
    if (hip_cm !== undefined) {
      fields.push("hip_cm = ?");
      params.push(hip_cm === null ? null : Number(hip_cm));
    }
    if (favorite_style !== undefined) {
      fields.push("favorite_style = ?");
      params.push(favorite_style);
    }
    if (preferred_color_tone !== undefined) {
      fields.push("preferred_color_tone = ?");
      params.push(preferred_color_tone);
    }
    if (body_shape !== undefined) {
      fields.push("body_shape = ?");
      params.push(body_shape);
    }
    if (usual_size !== undefined) {
      fields.push("usual_size = ?");
      params.push(usual_size);
    }
    if (fashion_budget_min !== undefined) {
      fields.push("fashion_budget_min = ?");
      params.push(fashion_budget_min === null ? null : Number(fashion_budget_min));
    }
    if (fashion_budget_max !== undefined) {
      fields.push("fashion_budget_max = ?");
      params.push(fashion_budget_max === null ? null : Number(fashion_budget_max));
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
      SELECT
        user_id, email, name, phone_number, age, gender, dateofbirth, job, picture_url, created_at,

        height_cm, weight_kg,
        bust_cm, waist_cm, hip_cm,
        favorite_style, preferred_color_tone,
        body_shape, usual_size,
        fashion_budget_min, fashion_budget_max
      FROM users
      WHERE user_id = ?
      LIMIT 1
      `,
      [user_id]
    );
    const normalized = normalizeRows(rows);
    return normalized[0] || null; // luôn trả ra 1 obj hoặc null
  } finally {
    if (conn) conn.release();
  }
}

export async function list({ filters = {}, limit = 20, offset = 0 } = {}) {
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

    addClause("user_id", f.user_id);
    addClause("email", f.email ? String(f.email).trim().toLowerCase() : f.email);
    addLikeClause("name", f.name);
    addLikeClause("phone_number", f.phone_number);
    addClause("age", f.age !== undefined && f.age !== null && f.age !== "" ? Number(f.age) : undefined);
    addClause("gender", f.gender ? String(f.gender).trim() : f.gender);
    addLikeClause("job", f.job);
    addClause("dateofbirth", f.dateofbirth ? toDateOnly(f.dateofbirth) : f.dateofbirth);

    const sql = `
      SELECT user_id, email, name, phone_number, age, gender, dateofbirth, job, picture_url, created_at
      FROM users
      ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""}
      ORDER BY user_id DESC
      LIMIT ? OFFSET ?
    `;

    const rows = await conn.query(sql, [...params, Number(limit ?? 20), Number(offset ?? 0)]);
    return normalizeRows(rows);
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

    return normalizeRows(rows);
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
    const normalized = normalizeRows(rows);
    return normalized[0] || null;
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
    const normalized = normalizeRows(rows);
    return normalized[0] || null;
  } finally {
    if (conn) conn.release();
  }
}