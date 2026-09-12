// src/back-end/service/itemMaterials.service.js
import {
  upsertItemMaterial,
  removeItemMaterial,
  listMaterialsByItemId,
  listItemsByMaterialId
} from "../database/item_materials.database.js";

export async function upsertItemMaterialService(payload) {
  return await upsertItemMaterial(payload);
}

export async function removeItemMaterialService(payload) {
  return await removeItemMaterial(payload);
}

export async function listMaterialsByItemIdService(item_id) {
  return await listMaterialsByItemId(item_id);
}

export async function listItemsByMaterialIdService(material_id) {
  return await listItemsByMaterialId(material_id);
}