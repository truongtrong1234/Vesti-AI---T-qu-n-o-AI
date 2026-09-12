import { initOpenAIChatModel } from "../utils/openai.util.js";
import { listClothingItemsService } from "./clothingItem.service.js";
import { getUserByIdService } from "./user.service.js";

function requireUserId(user) {
  const id = user?.id ?? user?.user_id;
  if (!id) throw new Error("UNAUTHORIZED");
  return Number(id);
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractJsonFromText(text) {
  if (!text) return null;
  const trimmed = String(text).trim();

  const direct = safeJsonParse(trimmed);
  if (direct) return direct;

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return safeJsonParse(trimmed.slice(firstBrace, lastBrace + 1));
  }
  return null;
}

function ensureOnlyUserItems(suggestions, allowedIds) {
  const invalid = [];

  const checkId = (id) => {
    if (id === null || id === undefined) return;
    const n = Number(id);
    if (!Number.isFinite(n) || !allowedIds.has(n)) invalid.push(id);
  };

  for (const s of suggestions) {
    checkId(s?.top);
    checkId(s?.bottom);
    checkId(s?.shoes);
    checkId(s?.outerwear);
    if (Array.isArray(s?.accessories)) s.accessories.forEach(checkId);
    if (Array.isArray(s?.other)) s.other.forEach(checkId);
  }

  return invalid;
}

function countMissingCoreParts(s) {
  let missing = 0;
  if (s?.top == null) missing++;
  if (s?.bottom == null) missing++;
  if (s?.shoes == null) missing++;
  return missing;
}

export async function suggestOutfitAIService(user, payload = {}) {
  const userId = requireUserId(user);

  const event = String(payload?.event ?? "").trim();
  const season = String(payload?.season ?? "").trim();
  const limit = Number(payload?.limit ?? 5);

  if (!event) throw new Error("MISSING_EVENT");
  if (!season) throw new Error("MISSING_SEASON");

  const userRow = await getUserByIdService(userId);

  const userProfile = userRow
    ? {
        job: userRow.job ?? null,
        age: userRow.age ?? null,

        height_cm: userRow.height_cm === undefined || userRow.height_cm === null ? null : Number(userRow.height_cm),
        weight_kg: userRow.weight_kg === undefined || userRow.weight_kg === null ? null : Number(userRow.weight_kg),

        bust_cm: userRow.bust_cm === undefined || userRow.bust_cm === null ? null : Number(userRow.bust_cm),
        waist_cm: userRow.waist_cm === undefined || userRow.waist_cm === null ? null : Number(userRow.waist_cm),
        hip_cm: userRow.hip_cm === undefined || userRow.hip_cm === null ? null : Number(userRow.hip_cm),

        favorite_style: userRow.favorite_style ?? null,
        preferred_color_tone: userRow.preferred_color_tone ?? null,

        body_shape: userRow.body_shape ?? null,
        usual_size: userRow.usual_size ?? null,

        fashion_budget_min:
          userRow.fashion_budget_min === undefined || userRow.fashion_budget_min === null
            ? null
            : Number(userRow.fashion_budget_min),
        fashion_budget_max:
          userRow.fashion_budget_max === undefined || userRow.fashion_budget_max === null
            ? null
            : Number(userRow.fashion_budget_max)
      }
    : null;

  const items = await listClothingItemsService(
    { user_id: userId, is_active: 1 },
    { limit: 1000, offset: 0, withTotal: false }
  );

  if (!items?.length) {
    return {
      user_id: Number(userId),
      event,
      season,
      limit,
      suggestions: [],
      message: "Tôi thấy bạn đang không có item phù hợp với style",
      suggest_link: null
    };
  }

  const allowedIds = new Set(items.map(i => Number(i.item_id)));

  const wardrobe = items.map(i => ({
    item_id: Number(i.item_id),
    name: i.name ?? null,
    category_id: i.category_id === undefined || i.category_id === null ? null : Number(i.category_id),
    brand: i.brand ?? null,
    color: i.color ?? null,
    size_id: i.size_id === undefined || i.size_id === null ? null : Number(i.size_id),
    notes: i.notes ?? null
  }));

  const model = initOpenAIChatModel();

  const system = `
You are a fashion outfit recommendation engine.
You MUST only use item_id values from the provided wardrobe list.

You MUST consider:
- EVENT (where/what the user will do)
- SEASON
- USER PROFILE (job, age, height/weight, bust/waist/hip, body shape, usual size, favorite style, preferred color tone, fashion budget)

Return STRICT JSON only. No markdown, no explanation.

JSON schema:
{
  "suggestions": [
    {
      "style_name": string,
      "reason": string,
      "top": number|null,
      "bottom": number|null,
      "shoes": number|null,
      "outerwear": number|null,
      "accessories": number[],
      "other": number[]
    }
  ]
}

Rules:
- Each suggestion should include at least top + bottom + shoes if possible.
- Avoid repeating the same exact combination.
- Respect favorite_style and preferred_color_tone when present.
- Respect budget: do not suggest buying items; only pick from wardrobe. If wardrobe lacks suitable items for the style, leave missing roles as null.
`.trim();

  const userPrompt = {
    user_id: Number(userId),
    event,
    season,
    limit,
    user_profile: userProfile,
    wardrobe_items: wardrobe
  };

  const aiRes = await model.invoke([
    { role: "system", content: system },
    { role: "user", content: JSON.stringify(userPrompt) }
  ]);

  const parsed = extractJsonFromText(aiRes?.content);

  if (!parsed || !Array.isArray(parsed.suggestions)) {
    throw new Error("AI_INVALID_RESPONSE");
  }

  const suggestions = parsed.suggestions.slice(0, limit).map(s => ({
    style_name: typeof s?.style_name === "string" ? s.style_name : (typeof s?.name === "string" ? s.name : "Outfit"),
    reason: typeof s?.reason === "string" ? s.reason : "",
    top: s?.top ?? null,
    bottom: s?.bottom ?? null,
    shoes: s?.shoes ?? null,
    outerwear: s?.outerwear ?? null,
    accessories: Array.isArray(s?.accessories) ? s.accessories : [],
    other: Array.isArray(s?.other) ? s.other : []
  }));

  const invalid = ensureOnlyUserItems(suggestions, allowedIds);
  if (invalid.length) throw new Error("AI_USED_UNKNOWN_ITEM");

  const allBad = suggestions.length === 0 || suggestions.every(s => countMissingCoreParts(s) >= 2);
  if (allBad) {
    return {
      user_id: Number(userId),
      event,
      season,
      limit,
      suggestions,
      message: "Tôi thấy bạn đang không có item phù hợp với style",
      suggest_link: null
    };
  }

  return { user_id: Number(userId), event, season, limit, user_profile: userProfile, suggestions };
}