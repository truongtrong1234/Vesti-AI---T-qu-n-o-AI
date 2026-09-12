// src/back-end/router/category.router.js
import express from "express";
import { validate } from "../middleware/validate.middleware.js";
// import authenticate from "../middleware/authenticate.middleware.js"; // bật nếu cần login
import { categoryValidate } from "../validation/category.validation.js";
import {
  createCategoryController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
  listCategoriesController
} from "../controller/category.controller.js";

const router = express.Router();

// Nếu muốn bảo vệ endpoint: thêm authenticate vào giữa, ví dụ:
// router.post("/", authenticate, categoryValidate.create(), validate, createCategoryController);

router.get("/", categoryValidate.list(), validate, listCategoriesController);
router.post("/", categoryValidate.create(), validate, createCategoryController);

router.get("/:category_id", categoryValidate.getById(), validate, getCategoryByIdController);
router.put("/:category_id", categoryValidate.update(), validate, updateCategoryController);
router.delete("/:category_id", categoryValidate.delete(), validate, deleteCategoryController);

export default router;