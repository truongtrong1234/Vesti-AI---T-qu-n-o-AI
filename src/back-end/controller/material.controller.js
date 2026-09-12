// src/back-end/controller/material.controller.js
import {
  createMaterialService,
  getMaterialByIdService,
  updateMaterialService,
  deleteMaterialService,
  listMaterialsService
} from "../service/material.service.js";

import { Success, BadRequest, NotFound, InternalServerError } from "../utils/responseHandler.utils.js";

export async function createMaterialController(req, res) {
  try {
    const data = await createMaterialService(req.body);
    return Success(res, data);
  } catch (err) {
    if (err?.message === "MATERIAL_NAME_ALREADY_EXISTS") return BadRequest(res, "Material name already exists");
    return InternalServerError(res, err?.message);
  }
}

export async function getMaterialByIdController(req, res) {
  try {
    const material_id = Number(req.params.material_id);
    const row = await getMaterialByIdService(material_id);
    if (!row) return NotFound(res, "Material not found");
    return Success(res, row);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function updateMaterialController(req, res) {
  try {
    const material_id = Number(req.params.material_id);
    const result = await updateMaterialService(material_id, req.body);
    if (!result || Number(result.affectedRows) === 0) return NotFound(res, "Material not found or nothing to update");
    return Success(res, result);
  } catch (err) {
    if (err?.message === "MATERIAL_NAME_ALREADY_EXISTS") return BadRequest(res, "Material name already exists");
    return InternalServerError(res, err?.message);
  }
}

export async function deleteMaterialController(req, res) {
  try {
    const material_id = Number(req.params.material_id);
    const result = await deleteMaterialService(material_id);
    if (!result || Number(result.affectedRows) === 0) return NotFound(res, "Material not found");
    return Success(res, result);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function listMaterialsController(req, res) {
  try {
    const filters = { material_id: req.query.material_id, name: req.query.name };
    const options = {
      limit: req.query.limit !== undefined ? Number(req.query.limit) : undefined,
      offset: req.query.offset !== undefined ? Number(req.query.offset) : undefined,
      orderBy: req.query.orderBy,
      orderDir: req.query.orderDir,
      withTotal: req.query.withTotal !== undefined ? Number(req.query.withTotal) === 1 : true
    };
    const data = await listMaterialsService(filters, options);
    return Success(res, data);
  } catch (err) {
    return BadRequest(res, err?.message);
  }
}