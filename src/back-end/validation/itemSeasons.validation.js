// src/back-end/validation/itemSeasons.validation.js
import * as bodyV from "./body.validation.js";
import * as paramV from "./param.validation.js";

export const itemSeasonsValidate = {
  add: () => [
    bodyV.number("item_id", 1, 9007199254740991, true, "Item ID"),
    bodyV.number("season_id", 1, 9007199254740991, true, "Season ID")
  ],

  remove: () => [
    bodyV.number("item_id", 1, 9007199254740991, true, "Item ID"),
    bodyV.number("season_id", 1, 9007199254740991, true, "Season ID")
  ],

  byItem: () => [paramV.number("item_id", 1, 9007199254740991, true, "Item ID")],

  bySeason: () => [paramV.number("season_id", 1, 9007199254740991, true, "Season ID")]
};