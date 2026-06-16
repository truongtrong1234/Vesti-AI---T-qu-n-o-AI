import {
  createUser,
  updateUser,
  changePassword,
  searchUserByName,
  getUserById
} from "../database/user.database.js";

export async function createUserService(payload) {
  return await createUser(payload);
}

export async function updateUserService(user_id, payload) {
  return await updateUser(user_id, payload);
}

export async function changePasswordService(user_id, new_password) {
  return await changePassword(user_id, new_password);
}

export async function searchUserByNameService(name, options) {
  return await searchUserByName(name, options);
}

export async function getUserByIdService(user_id) {
  return await getUserById(user_id);
}