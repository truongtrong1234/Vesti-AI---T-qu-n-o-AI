import {
  createClothingItemService,
  getClothingItemByIdService,
  updateClothingItemService,
  deleteClothingItemService,
  listClothingItemsService
} from "../service/clothingItem.service.js";

import {
  Success,
  BadRequest,
  NotFound,
  InternalServerError
} from "../utils/responseHandler.utils.js";

export async function createClothingItemController(req, res) {
  try {
    const data = await createClothingItemService(req.body);
    return Success(res, data);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function getClothingItemByIdController(req, res) {
  try {
    const item_id = Number(req.params.item_id);
    const row = await getClothingItemByIdService(item_id);
    if (!row) return NotFound(res, "Clothing item not found");
    return Success(res, row);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function updateClothingItemController(req, res) {
  try {
    const item_id = Number(req.params.item_id);

    const result = await updateClothingItemService(item_id, req.body);

    if (!result || Number(result.affectedRows) === 0) {
      return NotFound(res, "Clothing item not found or nothing to update");
    }

    return Success(res, result);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function deleteClothingItemController(req, res) {
  try {
    const item_id = Number(req.params.item_id);
    const result = await deleteClothingItemService(item_id);

    if (!result || Number(result.affectedRows) === 0) {
      return NotFound(res, "Clothing item not found");
    }

    return Success(res, result);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function listClothingItemsController(req, res) {
  try {
    const filters = {
      item_id: req.query.item_id,
      user_id: req.query.user_id,
      category_id: req.query.category_id,
      size_id: req.query.size_id,
      is_active: req.query.is_active,
      name: req.query.name,
      brand: req.query.brand,
      color: req.query.color
    };

    const options = {
      limit: req.query.limit !== undefined ? Number(req.query.limit) : undefined,
      offset: req.query.offset !== undefined ? Number(req.query.offset) : undefined,
      orderBy: req.query.orderBy,
      orderDir: req.query.orderDir,
      withTotal: req.query.withTotal !== undefined ? Number(req.query.withTotal) === 1 : true
    };

    const data = await listClothingItemsService(filters, options);
    return Success(res, data);
  } catch (err) {
    return BadRequest(res, err?.message);
  }
}