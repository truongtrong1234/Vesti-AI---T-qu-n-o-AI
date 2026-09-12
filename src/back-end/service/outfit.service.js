// src/back-end/service/outfit.service.js
import {
  createOutfit,
  getOutfitById,
  updateOutfit,
  deleteOutfit,
  listOutfits,
  countOutfits
} from "../database/outfit.database.js";

function requireUserId(user) {
  const id = user?.id ?? user?.user_id;
  if (!id) throw new Error("UNAUTHORIZED");
  return Number(id);
}

async function assertOutfitOwner(outfit_id, userId) {
  const outfit = await getOutfitById(outfit_id);
  if (!outfit) throw new Error("OUTFIT_NOT_FOUND");
  if (Number(outfit.user_id) !== Number(userId)) throw new Error("FORBIDDEN");
  return outfit;
}

export async function createOutfitService(user, payload) {
  const userId = requireUserId(user);
  return await createOutfit({ ...payload, user_id: userId });
}

export async function getOutfitByIdService(user, outfit_id) {
  const userId = requireUserId(user);
  const outfit = await assertOutfitOwner(outfit_id, userId);
  return outfit;
}

export async function updateOutfitService(user, outfit_id, payload) {
  const userId = requireUserId(user);
  await assertOutfitOwner(outfit_id, userId);
  return await updateOutfit(outfit_id, payload);
}

export async function deleteOutfitService(user, outfit_id) {
  const userId = requireUserId(user);
  await assertOutfitOwner(outfit_id, userId);
  return await deleteOutfit(outfit_id);
}

export async function listOutfitsService(user, filters = {}, options = {}) {
  const userId = requireUserId(user);

  const rows = await listOutfits({
    filters: { ...filters, user_id: userId },
    limit: options?.limit,
    offset: options?.offset,
    orderBy: options?.orderBy,
    orderDir: options?.orderDir
  });

  if (options?.withTotal) {
    const total = await countOutfits({ filters: { ...filters, user_id: userId } });
    return { rows, total, limit: Number(options?.limit ?? 20), offset: Number(options?.offset ?? 0) };
  }
  return rows;
}