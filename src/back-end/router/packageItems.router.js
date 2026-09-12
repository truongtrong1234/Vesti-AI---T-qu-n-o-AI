// src/back-end/router/packageItems.router.js
import express from "express";
import authenticate from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { packageItemsValidate } from "../validation/packageItems.validation.js";
import {
  upsertPackageItemController,
  removePackageItemController,
  listItemsByPackageIdController
} from "../controller/packageItems.controller.js";

const router = express.Router();

router.post("/", authenticate, packageItemsValidate.upsert(), validate, upsertPackageItemController);
router.delete("/", authenticate, packageItemsValidate.remove(), validate, removePackageItemController);

router.get("/by-package/:package_id", authenticate, packageItemsValidate.byPackage(), validate, listItemsByPackageIdController);

export default router;