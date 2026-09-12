// src/back-end/validation/packageItems.validation.js
import * as bodyV from "./body.validation.js";
import * as paramV from "./param.validation.js";

export const packageItemsValidate = {
  upsert: () => [
    bodyV.number("package_id", 1, 9007199254740991, true, "Package ID"),
    bodyV.number("item_id", 1, 9007199254740991, true, "Item ID"),
    bodyV.number("quantity", 1, 1000000, false, "Quantity"),
    bodyV.number("is_packed", 0, 1, false, "Is packed")
  ],
  remove: () => [
    bodyV.number("package_id", 1, 9007199254740991, true, "Package ID"),
    bodyV.number("item_id", 1, 9007199254740991, true, "Item ID")
  ],
  byPackage: () => [paramV.number("package_id", 1, 9007199254740991, true, "Package ID")]
};