// src/back-end/controller/packageItems.controller.js
import {
  upsertPackageItemService,
  removePackageItemService,
  listItemsByPackageIdService
} from "../service/packageItems.service.js";

import { Success, NotFound, Forbidden, InternalServerError } from "../utils/responseHandler.utils.js";

function mapServiceError(res, err) {
  if (err?.message === "PACKAGE_NOT_FOUND") return NotFound(res, "Package not found");
  if (err?.message === "FORBIDDEN") return Forbidden(res, "Forbidden");
  return InternalServerError(res, err?.message);
}

export async function upsertPackageItemController(req, res) {
  try {
    const data = await upsertPackageItemService(req.user, req.body);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function removePackageItemController(req, res) {
  try {
    const data = await removePackageItemService(req.user, req.body);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function listItemsByPackageIdController(req, res) {
  try {
    const package_id = Number(req.params.package_id);
    const data = await listItemsByPackageIdService(req.user, package_id);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}