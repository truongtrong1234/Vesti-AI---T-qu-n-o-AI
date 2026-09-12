import {
  addItemEvent,
  removeItemEvent,
  listEventsByItemId,
  listItemsByEventId
} from "../database/item_events.database.js";

export async function addItemEventService(payload) {
  return await addItemEvent(payload);
}

export async function removeItemEventService(payload) {
  return await removeItemEvent(payload);
}

export async function listEventsByItemIdService(item_id) {
  return await listEventsByItemId(item_id);
}

export async function listItemsByEventIdService(event_id) {
  return await listItemsByEventId(event_id);
}