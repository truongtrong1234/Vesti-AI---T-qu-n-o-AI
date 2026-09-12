// src/back-end/validation/material.validation.js
import * as bodyV from "./body.validation.js";
import * as queryV from "./query.validation.js";
import * as paramV from "./param.validation.js";

export const materialValidate = {
  create: () => [
    bodyV.url("image_url", 200, true, "Image URL"),
    bodyV.string("name", 80, true, v => (typeof v === "string" ? v.trim() : v), "Name"),
    bodyV.string("description", 200, true, v => (typeof v === "string" ? v.trim() : v), "Description")
  ],
  update: () => [
    paramV.number("material_id", 1, 9007199254740991, true, "Material ID"),
    bodyV.url("image_url", 200, false, "Image URL"),
    bodyV.string("name", 80, false, v => (typeof v === "string" ? v.trim() : v), "Name"),
    bodyV.string("description", 200, false, v => (typeof v === "string" ? v.trim() : v), "Description")
  ],
  getById: () => [paramV.number("material_id", 1, 9007199254740991, true, "Material ID")],
  delete: () => [paramV.number("material_id", 1, 9007199254740991, true, "Material ID")],
  list: () => [
    queryV.number("material_id", 1, 9007199254740991, false, "Material ID"),
    queryV.string("name", 80, false, "Name"),
    queryV.number("limit", 1, 200, false, "Limit"),
    queryV.number("offset", 0, 1000000000, false, "Offset")
  ]
};