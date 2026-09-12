// src/back-end/validation/itemEvents.validation.js
import * as bodyV from "./body.validation.js";
import * as paramV from "./param.validation.js";

export const itemEventsValidate = {
  add: () => [
    bodyV.number("item_id", 1, 9007199254740991, true, "Item ID"),
    bodyV.number("event_id", 1, 9007199254740991, true, "Event ID")
  ],

  remove: () => [
    bodyV.number("item_id", 1, 9007199254740991, true, "Item ID"),
    bodyV.number("event_id", 1, 9007199254740991, true, "Event ID")
  ],

  byItem: () => [paramV.number("item_id", 1, 9007199254740991, true, "Item ID")],

  byEvent: () => [paramV.number("event_id", 1, 9007199254740991, true, "Event ID")]
};