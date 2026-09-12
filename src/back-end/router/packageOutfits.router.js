// src/back-end/router/packageOutfits.router.js
import express from "express";
import authenticate from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { packageOutfitsValidate } from "../validation/packageOutfits.validation.js";
import {
  addPackageOutfitController,
  removePackageOutfitController,
  listOutfitsByPackageIdController
} from "../controller/packageOutfits.controller.js";

const router = express.Router();

router.post("/", authenticate, packageOutfitsValidate.add(), validate, addPackageOutfitController);
router.delete("/", authenticate, packageOutfitsValidate.remove(), validate, removePackageOutfitController);

router.get("/by-package/:package_id", authenticate, packageOutfitsValidate.byPackage(), validate, listOutfitsByPackageIdController);

export default router;