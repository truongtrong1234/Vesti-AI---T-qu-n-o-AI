import * as bodyV from "./body.validation.js";

export const aiSuggestValidate = {
  suggestOutfit: () => {
    return [
      bodyV.string("event", 120, true, v => (typeof v === "string" ? v.trim() : v), "Event"),
      bodyV.string("season", 40, true, v => (typeof v === "string" ? v.trim() : v), "Season"),
      bodyV.number("limit", 1, 10, false, "Limit")
    ];
  }
};