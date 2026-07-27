import {
  createClothingItem,
  getClothingItemById,
  updateClothingItem,
  deleteClothingItem,
  listClothingItems,
  countClothingItems
} from "../database/clothingItem.database.js";

export async function createClothingItemService(payload) {
  return await createClothingItem(payload);
}

export async function getClothingItemByIdService(item_id) {
  return await getClothingItemById(item_id);
}

export async function updateClothingItemService(item_id, payload) {
  return await updateClothingItem(item_id, payload);
}

export async function deleteClothingItemService(item_id) {
  return await deleteClothingItem(item_id);
}

/**
 * List service: filters + pagination
 * @param {object} filters
 * @param {object} options { limit, offset, orderBy, orderDir, withTotal }
 */
export async function listClothingItemsService(filters = {}, options = {}) {
  const limit = options?.limit;
  const offset = options?.offset;

  const orderBy = options?.orderBy;
  const orderDir = options?.orderDir;

  const rows = await listClothingItems({
    filters,
    limit,
    offset,
    orderBy,
    orderDir
  });

  if (options?.withTotal) {
    const total = await countClothingItems({ filters });
    return { rows, total, limit: Number(limit ?? 20), offset: Number(offset ?? 0) };
  }

  return rows;
}