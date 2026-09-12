// src/back-end/router/itemEvents.router.js
import express from "express";
import { validate } from "../middleware/validate.middleware.js";
// import authenticate from "../middleware/authenticate.middleware.js";
import { itemEventsValidate } from "../validation/itemEvents.validation.js";
import {
  addItemEventController,
  removeItemEventController,
  listEventsByItemIdController,
  listItemsByEventIdController
} from "../controller/itemEvents.controller.js";

const router = express.Router();

router.post("/", itemEventsValidate.add(), validate, addItemEventController);
router.delete("/", itemEventsValidate.remove(), validate, removeItemEventController);

router.get("/by-item/:item_id", itemEventsValidate.byItem(), validate, listEventsByItemIdController);
router.get("/by-event/:event_id", itemEventsValidate.byEvent(), validate, listItemsByEventIdController);

export default router;