// src/back-end/service/outfitItems.service.js
import { getOutfitById } from "../database/outfit.database.js";
import {
  upsertOutfitItem,
  removeOutfitItem,
  listItemsByOutfitId
} from "../database/outfitItems.database.js";

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

export async function upsertOutfitItemService(user, payload) {
  const userId = requireUserId(user);
  await assertOutfitOwner(payload?.outfit_id, userId);
  return await upsertOutfitItem(payload);
}

export async function removeOutfitItemService(user, payload) {
  const userId = requireUserId(user);
  await assertOutfitOwner(payload?.outfit_id, userId);
  return await removeOutfitItem(payload);
}

export async function listItemsByOutfitIdService(user, outfit_id) {
  const userId = requireUserId(user);
  await assertOutfitOwner(outfit_id, userId);
  return await listItemsByOutfitId(outfit_id);
}