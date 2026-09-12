// src/back-end/controller/packageOutfits.controller.js
import {
  addPackageOutfitService,
  removePackageOutfitService,
  listOutfitsByPackageIdService
} from "../service/packageOutfits.service.js";

import { Success, NotFound, Forbidden, InternalServerError, BadRequest } from "../utils/responseHandler.utils.js";

function mapServiceError(res, err) {
  if (err?.message === "PACKAGE_NOT_FOUND") return NotFound(res, "Package not found");
  if (err?.message === "OUTFIT_NOT_FOUND") return NotFound(res, "Outfit not found");
  if (err?.message === "FORBIDDEN") return Forbidden(res, "Forbidden");
  return InternalServerError(res, err?.message);
}

export async function addPackageOutfitController(req, res) {
  try {
    const data = await addPackageOutfitService(req.user, req.body);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function removePackageOutfitController(req, res) {
  try {
    const data = await removePackageOutfitService(req.user, req.body);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function listOutfitsByPackageIdController(req, res) {
  try {
    const package_id = Number(req.params.package_id);
    const data = await listOutfitsByPackageIdService(req.user, package_id);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}