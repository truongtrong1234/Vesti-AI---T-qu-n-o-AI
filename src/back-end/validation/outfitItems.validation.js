// src/back-end/validation/outfitItems.validation.js
import * as bodyV from "./body.validation.js";
import * as paramV from "./param.validation.js";

const ROLE_VALUES = ["top", "bottom", "shoes", "outerwear", "accessory", "other"];

export const outfitItemsValidate = {
  upsert: () => [
    bodyV.number("outfit_id", 1, 9007199254740991, true, "Outfit ID"),
    bodyV.number("item_id", 1, 9007199254740991, true, "Item ID"),
    bodyV.enumerate("role", ROLE_VALUES, false, "Role"),
    bodyV.number("position", 0, 65535, false, "Position")
  ],
  remove: () => [
    bodyV.number("outfit_id", 1, 9007199254740991, true, "Outfit ID"),
    bodyV.number("item_id", 1, 9007199254740991, true, "Item ID")
  ],
  byOutfit: () => [paramV.number("outfit_id", 1, 9007199254740991, true, "Outfit ID")]
};