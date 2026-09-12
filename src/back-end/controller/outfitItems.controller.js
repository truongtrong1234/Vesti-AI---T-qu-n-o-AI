// src/back-end/controller/outfitItems.controller.js
import {
  upsertOutfitItemService,
  removeOutfitItemService,
  listItemsByOutfitIdService
} from "../service/outfitItems.service.js";

import { Success, BadRequest, NotFound, Forbidden, InternalServerError } from "../utils/responseHandler.utils.js";

function mapServiceError(res, err) {
  if (err?.message === "OUTFIT_NOT_FOUND") return NotFound(res, "Outfit not found");
  if (err?.message === "FORBIDDEN") return Forbidden(res, "Forbidden");
  return InternalServerError(res, err?.message);
}

export async function upsertOutfitItemController(req, res) {
  try {
    const data = await upsertOutfitItemService(req.user, req.body);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function removeOutfitItemController(req, res) {
  try {
    const data = await removeOutfitItemService(req.user, req.body);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function listItemsByOutfitIdController(req, res) {
  try {
    const outfit_id = Number(req.params.outfit_id);
    const data = await listItemsByOutfitIdService(req.user, outfit_id);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}