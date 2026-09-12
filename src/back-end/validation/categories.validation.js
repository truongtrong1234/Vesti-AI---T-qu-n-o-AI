// src/back-end/validation/category.validation.js
import * as bodyV from "./body.validation.js";
import * as queryV from "./query.validation.js";
import * as paramV from "./param.validation.js";

export const categoryValidate = {
  create: () => {
    return [
      bodyV.string("code", 100, true, v => (typeof v === "string" ? v.trim() : v), "Code")
    ];
  },

  update: () => {
    return [
      paramV.number("category_id", 1, 9007199254740991, true, "Category ID"),
      bodyV.string("code", 100, false, v => (typeof v === "string" ? v.trim() : v), "Code")
    ];
  },

  getById: () => {
    return [paramV.number("category_id", 1, 9007199254740991, true, "Category ID")];
  },

  delete: () => {
    return [paramV.number("category_id", 1, 9007199254740991, true, "Category ID")];
  },

  list: () => {
    return [
      queryV.number("category_id", 1, 9007199254740991, false, "Category ID"),
      queryV.string("code", 100, false, "Code"),
      queryV.number("limit", 1, 200, false, "Limit"),
      queryV.number("offset", 0, 1000000000, false, "Offset")
    ];
  }
};