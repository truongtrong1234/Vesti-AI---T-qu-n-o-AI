import * as bodyV from "./body.validation.js";

export const aiSuggestValidate = {
  suggestOutfit: () => {
    return [
      bodyV.string("event", 150, true, v => (typeof v === "string" ? v.trim() : v), "Event"),
      bodyV.number("limit", 1, 20, false, "Limit")
    ];
  }
};