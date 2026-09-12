// src/back-end/controller/category.controller.js
import {
  createCategoryService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
  listCategoriesService
} from "../service/category.service.js";

import {
  Success,
  BadRequest,
  NotFound,
  InternalServerError
} from "../utils/responseHandler.utils.js";

export async function createCategoryController(req, res) {
  try {
    const data = await createCategoryService(req.body);
    return Success(res, data);
  } catch (err) {
    if (err?.message === "CATEGORY_CODE_ALREADY_EXISTS") {
      return BadRequest(res, "Category code already exists");
    }
    return InternalServerError(res, err?.message);
  }
}

export async function getCategoryByIdController(req, res) {
  try {
    const category_id = Number(req.params.category_id);
    const row = await getCategoryByIdService(category_id);
    if (!row) return NotFound(res, "Category not found");
    return Success(res, row);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function updateCategoryController(req, res) {
  try {
    const category_id = Number(req.params.category_id);
    const result = await updateCategoryService(category_id, req.body);

    if (!result || Number(result.affectedRows) === 0) {
      return NotFound(res, "Category not found or nothing to update");
    }

    return Success(res, result);
  } catch (err) {
    if (err?.message === "CATEGORY_CODE_ALREADY_EXISTS") {
      return BadRequest(res, "Category code already exists");
    }
    return InternalServerError(res, err?.message);
  }
}

export async function deleteCategoryController(req, res) {
  try {
    const category_id = Number(req.params.category_id);
    const result = await deleteCategoryService(category_id);

    if (!result || Number(result.affectedRows) === 0) {
      return NotFound(res, "Category not found");
    }

    return Success(res, result);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function listCategoriesController(req, res) {
  try {
    const filters = {
      category_id: req.query.category_id,
      code: req.query.code
    };

    const options = {
      limit: req.query.limit !== undefined ? Number(req.query.limit) : undefined,
      offset: req.query.offset !== undefined ? Number(req.query.offset) : undefined,
      orderBy: req.query.orderBy,
      orderDir: req.query.orderDir,
      withTotal: req.query.withTotal !== undefined ? Number(req.query.withTotal) === 1 : true
    };

    const data = await listCategoriesService(filters, options);
    return Success(res, data);
  } catch (err) {
    return BadRequest(res, err?.message);
  }
}