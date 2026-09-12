// src/back-end/service/itemSeasons.service.js
import {
  addItemSeason,
  removeItemSeason,
  listSeasonsByItemId,
  listItemsBySeasonId
} from "../database/item_seasons.database.js";

export async function addItemSeasonService(payload) {
  return await addItemSeason(payload);
}

export async function removeItemSeasonService(payload) {
  return await removeItemSeason(payload);
}

export async function listSeasonsByItemIdService(item_id) {
  return await listSeasonsByItemId(item_id);
}

export async function listItemsBySeasonIdService(season_id) {
  return await listItemsBySeasonId(season_id);
}