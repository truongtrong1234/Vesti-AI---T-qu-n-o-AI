// src/back-end/router/itemSeasons.router.js
import express from "express";
import { validate } from "../middleware/validate.middleware.js";
// import authenticate from "../middleware/authenticate.middleware.js";
import { itemSeasonsValidate } from "../validation/itemSeasons.validation.js";
import {
  addItemSeasonController,
  removeItemSeasonController,
  listSeasonsByItemIdController,
  listItemsBySeasonIdController
} from "../controller/itemSeasons.controller.js";

const router = express.Router();

router.post("/", itemSeasonsValidate.add(), validate, addItemSeasonController);
router.delete("/", itemSeasonsValidate.remove(), validate, removeItemSeasonController);

router.get("/by-item/:item_id", itemSeasonsValidate.byItem(), validate, listSeasonsByItemIdController);
router.get("/by-season/:season_id", itemSeasonsValidate.bySeason(), validate, listItemsBySeasonIdController);

export default router;