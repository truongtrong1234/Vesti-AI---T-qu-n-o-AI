// src/back-end/router/itemMaterials.router.js
import express from "express";
import { validate } from "../middleware/validate.middleware.js";
// import authenticate from "../middleware/authenticate.middleware.js";
import { itemMaterialsValidate } from "../validation/itemMaterials.validation.js";
import {
  upsertItemMaterialController,
  removeItemMaterialController,
  listMaterialsByItemIdController,
  listItemsByMaterialIdController
} from "../controller/itemMaterials.controller.js";

const router = express.Router();

router.post("/", itemMaterialsValidate.upsert(), validate, upsertItemMaterialController);
router.delete("/", itemMaterialsValidate.remove(), validate, removeItemMaterialController);

router.get("/by-item/:item_id", itemMaterialsValidate.byItem(), validate, listMaterialsByItemIdController);
router.get("/by-material/:material_id", itemMaterialsValidate.byMaterial(), validate, listItemsByMaterialIdController);

export default router;