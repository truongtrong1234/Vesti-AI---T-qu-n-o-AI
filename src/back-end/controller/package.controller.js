// src/back-end/controller/package.controller.js
import {
  createPackageService,
  getPackageByIdService,
  updatePackageService,
  deletePackageService,
  listPackagesService
} from "../service/package.service.js";

import { Success, BadRequest, NotFound, Forbidden, InternalServerError } from "../utils/responseHandler.utils.js";

function mapServiceError(res, err) {
  if (err?.message === "PACKAGE_NOT_FOUND") return NotFound(res, "Package not found");
  if (err?.message === "FORBIDDEN") return Forbidden(res, "Forbidden");
  return InternalServerError(res, err?.message);
}

export async function createPackageController(req, res) {
  try {
    const data = await createPackageService(req.user, req.body);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function getPackageByIdController(req, res) {
  try {
    const package_id = Number(req.params.package_id);
    const data = await getPackageByIdService(req.user, package_id);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function updatePackageController(req, res) {
  try {
    const package_id = Number(req.params.package_id);
    const data = await updatePackageService(req.user, package_id, req.body);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function deletePackageController(req, res) {
  try {
    const package_id = Number(req.params.package_id);
    const data = await deletePackageService(req.user, package_id);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}

export async function listPackagesController(req, res) {
  try {
    const filters = { package_id: req.query.package_id, name: req.query.name };
    const options = {
      limit: req.query.limit !== undefined ? Number(req.query.limit) : undefined,
      offset: req.query.offset !== undefined ? Number(req.query.offset) : undefined,
      orderBy: req.query.orderBy,
      orderDir: req.query.orderDir,
      withTotal: req.query.withTotal !== undefined ? Number(req.query.withTotal) === 1 : true
    };
    const data = await listPackagesService(req.user, filters, options);
    return Success(res, data);
  } catch (err) {
    return mapServiceError(res, err);
  }
}