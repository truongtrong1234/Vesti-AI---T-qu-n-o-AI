// src/back-end/validation/package.validation.js
import * as bodyV from "./body.validation.js";
import * as queryV from "./query.validation.js";
import * as paramV from "./param.validation.js";

export const packageValidate = {
  create: () => [
    bodyV.string("name", 120, true, v => (typeof v === "string" ? v.trim() : v), "Name"),
    bodyV.string("description", 255, false, v => (typeof v === "string" ? v.trim() : v), "Description"),
    bodyV.string("start_date", 10, false, v => (typeof v === "string" ? v.trim() : v), "Start date"),
    bodyV.string("end_date", 10, false, v => (typeof v === "string" ? v.trim() : v), "End date")
  ],
  update: () => [
    paramV.number("package_id", 1, 9007199254740991, true, "Package ID"),
    bodyV.string("name", 120, false, v => (typeof v === "string" ? v.trim() : v), "Name"),
    bodyV.string("description", 255, false, v => (typeof v === "string" ? v.trim() : v), "Description"),
    bodyV.string("start_date", 10, false, v => (typeof v === "string" ? v.trim() : v), "Start date"),
    bodyV.string("end_date", 10, false, v => (typeof v === "string" ? v.trim() : v), "End date")
  ],
  getById: () => [paramV.number("package_id", 1, 9007199254740991, true, "Package ID")],
  delete: () => [paramV.number("package_id", 1, 9007199254740991, true, "Package ID")],
  list: () => [
    queryV.number("package_id", 1, 9007199254740991, false, "Package ID"),
    queryV.string("name", 120, false, "Name"),
    queryV.number("limit", 1, 200, false, "Limit"),
    queryV.number("offset", 0, 1000000000, false, "Offset")
  ]
};