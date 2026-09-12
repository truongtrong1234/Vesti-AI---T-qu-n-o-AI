// src/back-end/service/material.service.js
import {
  createMaterial,
  getMaterialById,
  getMaterialByName,
  updateMaterial,
  deleteMaterial,
  listMaterials,
  countMaterials
} from "../database/material.database.js";

export async function createMaterialService(payload) {
  const existed = await getMaterialByName(payload?.name);
  if (existed) throw new Error("MATERIAL_NAME_ALREADY_EXISTS");
  return await createMaterial(payload);
}

export async function getMaterialByIdService(material_id) {
  return await getMaterialById(material_id);
}

export async function updateMaterialService(material_id, payload) {
  if (payload?.name !== undefined) {
    const existed = await getMaterialByName(payload.name);
    if (existed && Number(existed.material_id) !== Number(material_id)) {
      throw new Error("MATERIAL_NAME_ALREADY_EXISTS");
    }
  }
  return await updateMaterial(material_id, payload);
}

export async function deleteMaterialService(material_id) {
  return await deleteMaterial(material_id);
}

export async function listMaterialsService(filters = {}, options = {}) {
  const rows = await listMaterials({
    filters,
    limit: options?.limit,
    offset: options?.offset,
    orderBy: options?.orderBy,
    orderDir: options?.orderDir
  });

  if (options?.withTotal) {
    const total = await countMaterials({ filters });
    return { rows, total, limit: Number(options?.limit ?? 20), offset: Number(options?.offset ?? 0) };
  }

  return rows;
}