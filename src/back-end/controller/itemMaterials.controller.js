// src/back-end/controller/itemMaterials.controller.js
import {
  upsertItemMaterialService,
  removeItemMaterialService,
  listMaterialsByItemIdService,
  listItemsByMaterialIdService
} from "../service/itemMaterials.service.js";

import { Success, BadRequest, InternalServerError } from "../utils/responseHandler.utils.js";

export async function upsertItemMaterialController(req, res) {
  try {
    const data = await upsertItemMaterialService(req.body);
    return Success(res, data);
  } catch (err) {
    return BadRequest(res, err?.message);
  }
}

export async function removeItemMaterialController(req, res) {
  try {
    const data = await removeItemMaterialService(req.body);
    return Success(res, data);
  } catch (err) {
    return BadRequest(res, err?.message);
  }
}

export async function listMaterialsByItemIdController(req, res) {
  try {
    const item_id = Number(req.params.item_id);
    const data = await listMaterialsByItemIdService(item_id);
    return Success(res, data);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function listItemsByMaterialIdController(req, res) {
  try {
    const material_id = Number(req.params.material_id);
    const data = await listItemsByMaterialIdService(material_id);
    return Success(res, data);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}