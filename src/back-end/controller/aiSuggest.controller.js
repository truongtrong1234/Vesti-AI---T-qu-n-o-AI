import { suggestOutfitAIService } from "../service/aiSuggest.js";
import { Success, BadRequest, InternalServerError } from "../utils/responseHandler.utils.js";

export async function suggestOutfitAIController(req, res) {
  try {
    const data = await suggestOutfitAIService(req.user, req.body);
    return Success(res, data);
  } catch (err) {
    if (err?.message === "MISSING_EVENT") return BadRequest(res, "Missing event");
    if (err?.message === "MISSING_SEASON") return BadRequest(res, "Missing season");
    if (err?.message === "AI_INVALID_RESPONSE") return BadRequest(res, "AI response is invalid");
    if (err?.message === "AI_USED_UNKNOWN_ITEM") return BadRequest(res, "AI used items not in wardrobe");
    if (err?.message === "UNAUTHORIZED") return BadRequest(res, "Unauthorized");
    return InternalServerError(res, err?.message);
  }
}