// src/back-end/controller/itemEvents.controller.js
import {
  addItemEventService,
  removeItemEventService,
  listEventsByItemIdService,
  listItemsByEventIdService
} from "../service/itemEvents.service.js";

import { Success, BadRequest, InternalServerError } from "../utils/responseHandler.utils.js";

export async function addItemEventController(req, res) {
  try {
    const data = await addItemEventService(req.body);
    return Success(res, data);
  } catch (err) {
    return BadRequest(res, err?.message);
  }
}

export async function removeItemEventController(req, res) {
  try {
    const data = await removeItemEventService(req.body);
    return Success(res, data);
  } catch (err) {
    return BadRequest(res, err?.message);
  }
}

export async function listEventsByItemIdController(req, res) {
  try {
    const item_id = Number(req.params.item_id);
    const data = await listEventsByItemIdService(item_id);
    return Success(res, data);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function listItemsByEventIdController(req, res) {
  try {
    const event_id = Number(req.params.event_id);
    const data = await listItemsByEventIdService(event_id);
    return Success(res, data);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}