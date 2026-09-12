// src/back-end/router/package.router.js
import express from "express";
import authenticate from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { packageValidate } from "../validation/package.validation.js";
import {
  createPackageController,
  getPackageByIdController,
  updatePackageController,
  deletePackageController,
  listPackagesController
} from "../controller/package.controller.js";

const router = express.Router();

router.get("/", authenticate, packageValidate.list(), validate, listPackagesController);
router.post("/", authenticate, packageValidate.create(), validate, createPackageController);

router.get("/:package_id", authenticate, packageValidate.getById(), validate, getPackageByIdController);
router.put("/:package_id", authenticate, packageValidate.update(), validate, updatePackageController);
router.delete("/:package_id", authenticate, packageValidate.delete(), validate, deletePackageController);

export default router;