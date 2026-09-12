// src/back-end/service/packageOutfits.service.js
import { getPackageById } from "../database/package.database.js";
import { getOutfitById } from "../database/outfit.database.js";
import {
  addPackageOutfit,
  removePackageOutfit,
  listOutfitsByPackageId
} from "../database/packageOutfits.database.js";

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

async function assertOutfitOwner(outfit_id, userId) {
  const outfit = await getOutfitById(outfit_id);
  if (!outfit) throw new Error("OUTFIT_NOT_FOUND");
  if (Number(outfit.user_id) !== Number(userId)) throw new Error("FORBIDDEN");
  return outfit;
}

export async function addPackageOutfitService(user, payload) {
  const userId = requireUserId(user);
  await assertPackageOwner(payload?.package_id, userId);
  await assertOutfitOwner(payload?.outfit_id, userId);
  return await addPackageOutfit(payload);
}

export async function removePackageOutfitService(user, payload) {
  const userId = requireUserId(user);
  await assertPackageOwner(payload?.package_id, userId);
  return await removePackageOutfit(payload);
}

export async function listOutfitsByPackageIdService(user, package_id) {
  const userId = requireUserId(user);
  await assertPackageOwner(package_id, userId);
  return await listOutfitsByPackageId(package_id);
}