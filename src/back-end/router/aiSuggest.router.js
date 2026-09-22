import express from "express";
import authenticate from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { aiSuggestValidate } from "../validation/aiSuggest.validation.js";
import { suggestOutfitAIController } from "../controller/aiSuggest.controller.js";

const router = express.Router();

// POST /ai/suggest-outfit
router.post(
  "/suggest-outfit",
  authenticate,
  aiSuggestValidate.suggestOutfit(),
  validate,
  suggestOutfitAIController
);

export default router;