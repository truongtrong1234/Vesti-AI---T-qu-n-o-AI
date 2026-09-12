// src/back-end/service/category.service.js
import {
  createCategory,
  getCategoryById,
  getCategoryByCode,
  updateCategory,
  deleteCategory,
  listCategories,
  countCategories
} from "../database/category.database.js";

export async function createCategoryService(payload) {
  // Optional: check duplicate code
  const existed = await getCategoryByCode(payload?.code);
  if (existed) throw new Error("CATEGORY_CODE_ALREADY_EXISTS");

  return await createCategory(payload);
}

export async function getCategoryByIdService(category_id) {
  return await getCategoryById(category_id);
}

export async function updateCategoryService(category_id, payload) {
  if (payload?.code !== undefined) {
    const existed = await getCategoryByCode(payload.code);
    if (existed && Number(existed.category_id) !== Number(category_id)) {
      throw new Error("CATEGORY_CODE_ALREADY_EXISTS");
    }
  }

  return await updateCategory(category_id, payload);
}

export async function deleteCategoryService(category_id) {
  return await deleteCategory(category_id);
}

/**
 * List service: filters + pagination
 * @param {object} filters
 * @param {object} options { limit, offset, orderBy, orderDir, withTotal }
 */
export async function listCategoriesService(filters = {}, options = {}) {
  const limit = options?.limit;
  const offset = options?.offset;

  const orderBy = options?.orderBy;
  const orderDir = options?.orderDir;

  const rows = await listCategories({
    filters,
    limit,
    offset,
    orderBy,
    orderDir
  });

  if (options?.withTotal) {
    const total = await countCategories({ filters });
    return { rows, total, limit: Number(limit ?? 20), offset: Number(offset ?? 0) };
  }

  return rows;
}