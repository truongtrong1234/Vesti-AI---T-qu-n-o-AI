// src/back-end/controller/outfit.controller.js
import {
  createOutfitService,
  getOutfitByIdService,
  updateOutfitService,
  deleteOutfitService,
  listOutfitsService
} from "../service/outfit.service.js";

import { Success, BadRequest, NotFound, Forbidden, InternalServerError } from "../utils/responseHandler.utils.js";

function mapServiceError(res, err) {
  if (err?.message === "UNAUTHORIZED") return BadRequest(res, "Unauthorized");
  if (err?.message === "OUTFIT_NOT_FOUND") return NotFound(res, "Outfit not found");
  if (err?.message === "FORBIDDEN") return Forbidden(res, "Forbidden");
  return InternalServerError(res, err?.message);
}

export async function createOutfitController(req, res) {
  try {
    const data = await createOutfitService(req.user, req.body);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function getOutfitByIdController(req, res) {
  try {
    const outfit_id = Number(req.params.outfit_id);
    const data = await getOutfitByIdService(req.user, outfit_id);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function updateOutfitController(req, res) {
  try {
    const outfit_id = Number(req.params.outfit_id);
    const data = await updateOutfitService(req.user, outfit_id, req.body);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function deleteOutfitController(req, res) {
  try {
    const outfit_id = Number(req.params.outfit_id);
    const data = await deleteOutfitService(req.user, outfit_id);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function listOutfitsController(req, res) {
  try {
    const filters = {
      outfit_id: req.query.outfit_id,
      style_id: req.query.style_id,
      worn_date: req.query.worn_date
    };

    const options = {
      limit: req.query.limit !== undefined ? Number(req.query.limit) : undefined,
      offset: req.query.offset !== undefined ? Number(req.query.offset) : undefined,
      orderBy: req.query.orderBy,
      orderDir: req.query.orderDir,
      withTotal: req.query.withTotal !== undefined ? Number(req.query.withTotal) === 1 : true
    };

    const data = await listOutfitsService(req.user, filters, options);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}