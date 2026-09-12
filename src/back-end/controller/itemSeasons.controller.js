// src/back-end/controller/itemSeasons.controller.js
import {
  addItemSeasonService,
  removeItemSeasonService,
  listSeasonsByItemIdService,
  listItemsBySeasonIdService
} from "../service/itemSeasons.service.js";

import { Success, BadRequest, InternalServerError } from "../utils/responseHandler.utils.js";

export async function addItemSeasonController(req, res) {
  try {
    const data = await addItemSeasonService(req.body);
    return Success(res, data);
  } catch (err) {
    return BadRequest(res, err?.message);
  }
}

export async function removeItemSeasonController(req, res) {
  try {
    const data = await removeItemSeasonService(req.body);
    return Success(res, data);
  } catch (err) {
    return BadRequest(res, err?.message);
  }
}

export async function listSeasonsByItemIdController(req, res) {
  try {
    const item_id = Number(req.params.item_id);
    const data = await listSeasonsByItemIdService(item_id);
    return Success(res, data);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}

export async function listItemsBySeasonIdController(req, res) {
  try {
    const season_id = Number(req.params.season_id);
    const data = await listItemsBySeasonIdService(season_id);
    return Success(res, data);
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}