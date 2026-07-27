import express from "express";
import authenticate from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createClothingItemController,
  getClothingItemByIdController,
  updateClothingItemController,
  deleteClothingItemController,
  listClothingItemsController
} from "../controller/clothingItem.controller.js";

import { clothingItemsValidate } from "../validation/clothingItem.validation.js";

const router = express.Router();

// LIST (filter + pagination)
router.get("/", authenticate, clothingItemsValidate.list(), validate, listClothingItemsController);

// CREATE
router.post("/", authenticate, clothingItemsValidate.create(), validate, createClothingItemController);

// GET BY ID
router.get("/:item_id", authenticate, clothingItemsValidate.getById(), validate, getClothingItemByIdController);

// UPDATE
router.put("/:item_id", authenticate, clothingItemsValidate.update(), validate, updateClothingItemController);

// DELETE
router.delete("/:item_id", authenticate, clothingItemsValidate.remove(), validate, deleteClothingItemController);

export default router;