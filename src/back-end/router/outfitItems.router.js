// src/back-end/router/outfitItems.router.js
import express from "express";
import authenticate from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { outfitItemsValidate } from "../validation/outfitItems.validation.js";
import {
  upsertOutfitItemController,
  removeOutfitItemController,
  listItemsByOutfitIdController
} from "../controller/outfitItems.controller.js";

const router = express.Router();

router.post("/", authenticate, outfitItemsValidate.upsert(), validate, upsertOutfitItemController);
router.delete("/", authenticate, outfitItemsValidate.remove(), validate, removeOutfitItemController);

router.get("/by-outfit/:outfit_id", authenticate, outfitItemsValidate.byOutfit(), validate, listItemsByOutfitIdController);

export default router;