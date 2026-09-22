import {
  createClothingItemService,
  getClothingItemByIdService,
  updateClothingItemService,
  deleteClothingItemService,
  listClothingItemsService
} from "../service/clothingItem.service.js";

import {
  SuccessSafe,
  BadRequest,
  NotFound,
  InternalServerError
} from "../utils/responseHandler.utils.js";

// ... existing code ...
export async function createClothingItemController(req, res) {
  try {
    const data = await createClothingItemService(req.user, req.body);
    return SuccessSafe(res, data);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

// ... existing code ...
export async function getClothingItemByIdController(req, res) {
  try {
    const item_id = Number(req.params.item_id);
    const row = await getClothingItemByIdService(item_id);
    if (!row) return NotFound(res, "Clothing item not found");
    return SuccessSafe(res, row);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

// ... existing code ...
export async function updateClothingItemController(req, res) {
  try {
    const item_id = Number(req.params.item_id);

    const result = await updateClothingItemService(item_id, req.body);

    if (!result || Number(result.affectedRows) === 0) {
      return NotFound(res, "Clothing item not found or nothing to update");
    }

    return SuccessSafe(res, result);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

// ... existing code ...
export async function deleteClothingItemController(req, res) {
  try {
    const item_id = Number(req.params.item_id);
    const result = await deleteClothingItemService(item_id);

    if (!result || Number(result.affectedRows) === 0) {
      return NotFound(res, "Clothing item not found");
    }

    return SuccessSafe(res, result);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

// ... existing code ...
export async function listClothingItemsController(req, res) {
  try {
    const authUserId = Number(req.user?.id ?? req.user?.user_id);

    const filters = {
      item_id: req.query.item_id,
      user_id: authUserId, // force: only items of logged-in user
      is_active: req.query.is_active,

      name: req.query.name,
      brand: req.query.brand,
      color: req.query.color,

      main_category: req.query.main_category,
      category: req.query.category,
      type: req.query.type,
      gender: req.query.gender,
      event: req.query.event,
      seasons: req.query.seasons,
      material: req.query.material,
      size: req.query.size
    };

    const options = {
      limit: req.query.limit !== undefined ? Number(req.query.limit) : undefined,
      offset: req.query.offset !== undefined ? Number(req.query.offset) : undefined,
      orderBy: req.query.orderBy,
      orderDir: req.query.orderDir,
      withTotal: req.query.withTotal !== undefined ? Number(req.query.withTotal) === 1 : true
    };

    const data = await listClothingItemsService(filters, options);
    return SuccessSafe(res, data);
  } catch (err) {
    return BadRequest(res, err?.message);
  }
}