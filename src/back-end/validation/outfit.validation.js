// src/back-end/validation/outfit.validation.js
import * as bodyV from "./body.validation.js";
import * as queryV from "./query.validation.js";
import * as paramV from "./param.validation.js";

export const outfitValidate = {
  create: () => [
    bodyV.string("worn_date", 10, true, v => (typeof v === "string" ? v.trim() : v), "Worn date"),
    bodyV.number("style_id", 1, 9007199254740991, true, "Style ID"),
    bodyV.string("note", 255, false, v => (typeof v === "string" ? v.trim() : v), "Note")
  ],
  update: () => [
    paramV.number("outfit_id", 1, 9007199254740991, true, "Outfit ID"),
    bodyV.string("worn_date", 10, false, v => (typeof v === "string" ? v.trim() : v), "Worn date"),
    bodyV.number("style_id", 1, 9007199254740991, false, "Style ID"),
    bodyV.string("note", 255, false, v => (typeof v === "string" ? v.trim() : v), "Note")
  ],
  getById: () => [paramV.number("outfit_id", 1, 9007199254740991, true, "Outfit ID")],
  delete: () => [paramV.number("outfit_id", 1, 9007199254740991, true, "Outfit ID")],
  list: () => [
    queryV.number("outfit_id", 1, 9007199254740991, false, "Outfit ID"),
    queryV.number("style_id", 1, 9007199254740991, false, "Style ID"),
    queryV.string("worn_date", 10, false, "Worn date"),
    queryV.number("limit", 1, 200, false, "Limit"),
    queryV.number("offset", 0, 1000000000, false, "Offset")
  ]
};