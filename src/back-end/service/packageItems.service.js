// src/back-end/service/packageItems.service.js
import { getPackageById } from "../database/package.database.js";
import { upsertPackageItem, removePackageItem, listItemsByPackageId } from "../database/packageItems.database.js";

function requireUserId(user) {
  const id = user?.id ?? user?.user_id;
  if (!id) throw new Error("UNAUTHORIZED");
  return Number(id);
}

async function assertPackageOwner(package_id, userId) {
  const pkg = await getPackageById(package_id);
  if (!pkg) throw new Error("PACKAGE_NOT_FOUND");
  if (Number(pkg.user_id) !== Number(userId)) throw new Error("FORBIDDEN");
  return pkg;
}

export async function upsertPackageItemService(user, payload) {
  const userId = requireUserId(user);
  await assertPackageOwner(payload?.package_id, userId);
  return await upsertPackageItem(payload);
}

export async function removePackageItemService(user, payload) {
  const userId = requireUserId(user);
  await assertPackageOwner(payload?.package_id, userId);
  return await removePackageItem(payload);
}

export async function listItemsByPackageIdService(user, package_id) {
  const userId = requireUserId(user);
  await assertPackageOwner(package_id, userId);
  return await listItemsByPackageId(package_id);
}