// src/back-end/router/material.router.js
import express from "express";
import { validate } from "../middleware/validate.middleware.js";
// import authenticate from "../middleware/authenticate.middleware.js";
import { materialValidate } from "../validation/material.validation.js";
import {
  createMaterialController,
  getMaterialByIdController,
  updateMaterialController,
  deleteMaterialController,
  listMaterialsController
} from "../controller/material.controller.js";

const router = express.Router();

router.get("/", materialValidate.list(), validate, listMaterialsController);
router.post("/", materialValidate.create(), validate, createMaterialController);

router.get("/:material_id", materialValidate.getById(), validate, getMaterialByIdController);
router.put("/:material_id", materialValidate.update(), validate, updateMaterialController);
router.delete("/:material_id", materialValidate.delete(), validate, deleteMaterialController);

export default router;