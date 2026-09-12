// src/back-end/validation/packageOutfits.validation.js
import * as bodyV from "./body.validation.js";
import * as paramV from "./param.validation.js";

export const packageOutfitsValidate = {
  add: () => [
    bodyV.number("package_id", 1, 9007199254740991, true, "Package ID"),
    bodyV.number("outfit_id", 1, 9007199254740991, true, "Outfit ID")
  ],
  remove: () => [
    bodyV.number("package_id", 1, 9007199254740991, true, "Package ID"),
    bodyV.number("outfit_id", 1, 9007199254740991, true, "Outfit ID")
  ],
  byPackage: () => [paramV.number("package_id", 1, 9007199254740991, true, "Package ID")]
};