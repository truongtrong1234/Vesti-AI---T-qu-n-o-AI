// src/back-end/router/outfit.router.js
import express from "express";
import authenticate from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { outfitValidate } from "../validation/outfit.validation.js";
import {
  createOutfitController,
  getOutfitByIdController,
  updateOutfitController,
  deleteOutfitController,
  listOutfitsController
} from "../controller/outfit.controller.js";

const router = express.Router();

router.get("/", authenticate, outfitValidate.list(), validate, listOutfitsController);
router.post("/", authenticate, outfitValidate.create(), validate, createOutfitController);

router.get("/:outfit_id", authenticate, outfitValidate.getById(), validate, getOutfitByIdController);
router.put("/:outfit_id", authenticate, outfitValidate.update(), validate, updateOutfitController);
router.delete("/:outfit_id", authenticate, outfitValidate.delete(), validate, deleteOutfitController);

export default router;