import * as bodyV from "./body.validation.js";
import * as queryV from "./query.validation.js";
import * as paramV from "./param.validation.js";

const BIGINT_MAX = 9007199254740991;

export const clothingItemsValidate = {
  create: () => {
    return [
      bodyV.number("user_id", 1, BIGINT_MAX, true, "User ID"),
      bodyV.string("name", 150, true, v => (typeof v === "string" ? v.trim() : v), "Name"),
      bodyV.number("category_id", 1, BIGINT_MAX, true, "Category ID"),

      bodyV.string("brand", 80, false, v => (typeof v === "string" ? v.trim() : v), "Brand"),
      bodyV.string("color", 50, false, v => (typeof v === "string" ? v.trim() : v), "Color"),
      bodyV.number("size_id", 1, BIGINT_MAX, false, "Size ID"),

      bodyV.string("image_url", 65535, false, v => (typeof v === "string" ? v.trim() : v), "Image URL"),
      bodyV.string("notes", 65535, false, v => (typeof v === "string" ? v.trim() : v), "Notes"),

      bodyV.bool("is_active", false, "Is active")
    ];
  },

  update: () => {
    return [
      paramV.number("item_id", 1, BIGINT_MAX, true, "Item ID"),

      bodyV.number("user_id", 1, BIGINT_MAX, false, "User ID"),
      bodyV.string("name", 150, false, v => (typeof v === "string" ? v.trim() : v), "Name"),
      bodyV.number("category_id", 1, BIGINT_MAX, false, "Category ID"),

      bodyV.string("brand", 80, false, v => (typeof v === "string" ? v.trim() : v), "Brand"),
      bodyV.string("color", 50, false, v => (typeof v === "string" ? v.trim() : v), "Color"),
      bodyV.number("size_id", 1, BIGINT_MAX, false, "Size ID"),

      bodyV.string("image_url", 65535, false, v => (typeof v === "string" ? v.trim() : v), "Image URL"),
      bodyV.string("notes", 65535, false, v => (typeof v === "string" ? v.trim() : v), "Notes"),

      bodyV.bool("is_active", false, "Is active")
    ];
  },

  getById: () => {
    return [paramV.number("item_id", 1, BIGINT_MAX, true, "Item ID")];
  },

  remove: () => {
    return [paramV.number("item_id", 1, BIGINT_MAX, true, "Item ID")];
  },

  list: () => {
    return [
      queryV.number("item_id", 1, BIGINT_MAX, false, "Item ID"),
      queryV.number("user_id", 1, BIGINT_MAX, false, "User ID"),
      queryV.number("category_id", 1, BIGINT_MAX, false, "Category ID"),
      queryV.number("size_id", 1, BIGINT_MAX, false, "Size ID"),
      queryV.number("is_active", 0, 1, false, "Is active"),

      queryV.string("name", 150, false, "Name"),
      queryV.string("brand", 80, false, "Brand"),
      queryV.string("color", 50, false, "Color"),

      queryV.number("limit", 1, 200, false, "Limit"),
      queryV.number("offset", 0, 1000000000, false, "Offset"),

      queryV.string("orderBy", 50, false, "Order by"),
      queryV.string("orderDir", 10, false, "Order dir"),

      queryV.number("withTotal", 0, 1, false, "With total")
    ];
  }
};