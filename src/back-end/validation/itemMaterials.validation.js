// src/back-end/validation/itemMaterials.validation.js
import * as bodyV from "./body.validation.js";
import * as paramV from "./param.validation.js";

export const itemMaterialsValidate = {
  upsert: () => [
    bodyV.number("item_id", 1, 9007199254740991, true, "Item ID"),
    bodyV.number("material_id", 1, 9007199254740991, true, "Material ID"),
    bodyV.number("percentage", 0, 100, false, "Percentage")
  ],

  remove: () => [
    bodyV.number("item_id", 1, 9007199254740991, true, "Item ID"),
    bodyV.number("material_id", 1, 9007199254740991, true, "Material ID")
  ],

  byItem: () => [paramV.number("item_id", 1, 9007199254740991, true, "Item ID")],

  byMaterial: () => [paramV.number("material_id", 1, 9007199254740991, true, "Material ID")]
};