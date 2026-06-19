import {
  createUser,
  updateUser,
  changePassword,
  searchUserByName,
  getUserById,
  getUserByEmail
} from "../database/user.database.js";
import bcrypt from "bcrypt";

export async function createUserService(payload) {
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(String(payload.password), SALT_ROUNDS);
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const existed = await getUserByEmail(email);
  if (existed) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }
  return await createUser({
    ...payload,
    password: hashedPassword
  });
}

export async function updateUserService(user_id, payload) {
  return await updateUser(user_id, payload);
}

export async function changePasswordService(user_id, new_password) {
  const hashedPassword = await bcrypt.hash(String(new_password), SALT_ROUNDS);
  return await changePassword(user_id, hashedPassword);
}

export async function searchUserByNameService(name, options) {
  return await searchUserByName(name, options);
}

export async function getUserByIdService(user_id) {
  return await getUserById(user_id);
}