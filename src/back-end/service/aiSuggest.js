import { initOpenAIChatModel } from "../utils/openai.util.js";
import { listClothingItemsService } from "./clothingItem.service.js";
import { getUserByIdService } from "./user.service.js";

function requireUserId(user) {
  const id = user?.id ?? user?.user_id;
  if (!id) throw new Error("UNAUTHORIZED");
  return Number(id);
}
function detectSeasonFromMonth(date = new Date()) {
  const m = date.getMonth() + 1; // 1–12
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
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

function ensureOnlyUserItems(suggestion, allowedIds) {
  const invalid = [];

  const checkId = (id) => {
    if (id === null || id === undefined) return;
    const n = Number(id);
    if (!Number.isFinite(n) || !allowedIds.has(n)) invalid.push(id);
  };

  checkId(suggestion?.top);
  checkId(suggestion?.bottom);
  checkId(suggestion?.shoes);
  checkId(suggestion?.outerwear);
  if (Array.isArray(suggestion?.accessories)) suggestion.accessories.forEach(checkId);

  return invalid;
}

function buildShopeeLink(keyword) {
  if (!keyword) return null;
  const q = encodeURIComponent(String(keyword));
  return `https://shopee.vn/search?keyword=${q}`;
}

/**
 * Kiểm tra hồ sơ user đã đủ thông tin để dùng AI suggest chưa.
 * Nếu thiếu, trả về danh sách field thiếu.
 */
function getMissingProfileFields(userRow) {
  const required = [
    "favorite_style",
    "height_cm",
    "weight_kg",
    "body_shape",
    "usual_size",
    "fashion_budget_min",
    "fashion_budget_max",
    "bust_cm",
    "waist_cm",
    "hip_cm",
    "preferred_color_tone"
  ];

  const missing = [];

  for (const field of required) {
    const v = userRow?.[field];
    if (v === undefined || v === null || v === "") {
      missing.push(field);
    }
  }

  return missing;
}

export async function suggestOutfitAIService(user, payload = {}) {
  const userId = requireUserId(user);
  const limit = Number(payload?.limit ?? 1); // 1 outfit, client có thể chỉnh

  // ---- EVENT (bắt buộc, user nhập) ----
  const event = String(payload?.event ?? "").trim();
  if (!event) {
    throw new Error("MISSING_EVENT");
  }

  // ---- SEASON(S) (có thể client gửi, hoặc để AI tự suy theo prompt) ----
  // Nếu có season trong payload thì dùng, nếu không để null và yêu cầu AI tự chọn.
const season = payload?.season
  ? String(payload.season).trim()
  : detectSeasonFromMonth();

  const userRow = await getUserByIdService(userId);
  if (!userRow) {
    throw new Error("UNAUTHORIZED");
  }

  // Nếu profile thiếu thông tin bắt buộc -> không cho dùng gợi ý
  const missingProfile = getMissingProfileFields(userRow);
  if (missingProfile.length > 0) {
    const err = new Error("PROFILE_INCOMPLETE");
    err.missingProfile = missingProfile;
    throw err;
  }

  // Lấy profile user, bỏ email, phone, password, picture_url
  const userProfile = {
    user_id: userRow.user_id,
    name: userRow.name ?? null,
    age: userRow.age ?? null,
    gender: userRow.gender ?? null,
    job: userRow.job ?? null,
    dateofbirth: userRow.dateofbirth ?? null,

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
  };

  // Lấy item có sẵn của user
  const items = await listClothingItemsService(
    { user_id: userId, is_active: 1 },
    { limit: 1000, offset: 0, withTotal: false }
  );

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
Bạn là một stylist thời trang.

NHIỆM VỤ:
- Tạo OUTFIT dựa trên:
  - EVENT user sẽ tham gia (event từ user_prompt).
  - SEASON/SEASONS:
    - Nếu "season" trong user_prompt là null hoặc rỗng, bạn hãy tự chọn mùa phù hợp
      dựa trên event + favorite_style + wardrobe_items (ví dụ: "spring", "summer", "autumn", "winter").
    - Nếu "season" có giá trị, hãy ưu tiên mùa đó.
  - favorite_style của user (bắt buộc)
  - thông tin cơ thể (chiều cao, cân nặng, body_shape, số đo, usual_size)
  - tủ đồ hiện tại (wardrobe_items).

- Bạn CHỈ được dùng item_id trong wardrobe_items cho các phần:
  top, bottom, shoes, outerwear, accessories.

- VỀ PHỤ KIỆN (accessories):
  - Luôn cố gắng gợi ý NHIỀU PHỤ KIỆN kết hợp (ví dụ: đồng hồ, vòng cổ, hoa tai, nhẫn, túi xách,…).
  - accessories là MẢNG các item_id (có thể rỗng nếu user không có phụ kiện phù hợp).
  - Nếu không có phụ kiện phù hợp trong wardrobe_items, hãy:
    - Để accessories là [] (mảng rỗng).
    - Ghi rõ các phụ kiện gợi ý vào missing_items.accessories là một MẢNG string,
      mỗi string mô tả 1 phụ kiện cần mua (ví dụ:
      "dây chuyền bạc mảnh tối giản",
      "túi xách da màu đen đeo chéo",
      "hoa tai vàng nhỏ hình tròn").

- Nếu trong tủ đồ không có item phù hợp cho một phần nào đó (top, bottom, shoes, outerwear),
  hãy để giá trị đó là null
  và gợi ý TÊN item bị thiếu (ví dụ: "áo sơ mi trắng form rộng", "quần tây đen ống suông")
  trong missing_items tương ứng.

TRẢ VỀ JSON THUẦN (KHÔNG markdown, không giải thích ngoài JSON).

SCHEMA BẮT BUỘC:

{
  "suggestions": [
    {
      "reason": string,
      "top": number|null,
      "bottom": number|null,
      "shoes": number|null,
      "outerwear": number|null,

      "accessories": number[],

      "missing_items": {
        "top"?: string,
        "bottom"?: string,
        "shoes"?: string,
        "outerwear"?: string,
        "accessories"?: string[]
      }
    }
  ]
}

YÊU CẦU:
- Ít nhất 1 outfit, tối đa = "limit" từ user_prompt.
- Tập trung thể hiện rõ favorite_style.
- Phù hợp với EVENT và SEASON đã chọn.
- Nếu user không có đủ đồ (đặc biệt là PHỤ KIỆN), hãy điền "missing_items" mô tả TÊN item cần mua thêm.
- Tuyệt đối không dùng item_id ngoài wardrobe_items.
  `.trim();

  const userPrompt = {
    user_profile: userProfile,
    wardrobe_items: wardrobe,
    event,           // event do user nhập
    season: season,  // có thể null, để AI tự chọn
    limit: limit
  };

  const aiRes = await model.invoke([
    { role: "system", content: system },
    { role: "user", content: JSON.stringify(userPrompt) }
  ]);

  const parsed = extractJsonFromText(aiRes?.content);

  if (!parsed || !Array.isArray(parsed.suggestions)) {
    throw new Error("AI_INVALID_RESPONSE");
  }

  const rawSuggestions = parsed.suggestions.slice(0, limit);

  const normalized = rawSuggestions.map(s => {
    const sug = {
      reason: typeof s?.reason === "string" ? s.reason : "",
      top: s?.top ?? null,
      bottom: s?.bottom ?? null,
      shoes: s?.shoes ?? null,
      outerwear: s?.outerwear ?? null,
      accessories: Array.isArray(s?.accessories) ? s.accessories : []
    };

    const invalid = ensureOnlyUserItems(sug, allowedIds);
    if (invalid.length) {
      throw new Error("AI_USED_UNKNOWN_ITEM");
    }

    const missing = {
      top: s?.missing_items?.top ?? undefined,
      bottom: s?.missing_items?.bottom ?? undefined,
      shoes: s?.missing_items?.shoes ?? undefined,
      outerwear: s?.missing_items?.outerwear ?? undefined,
      accessories: Array.isArray(s?.missing_items?.accessories) ? s.missing_items.accessories : undefined
    };

    const shopee_links = {};
    if (missing.top) shopee_links.top = buildShopeeLink(missing.top);
    if (missing.bottom) shopee_links.bottom = buildShopeeLink(missing.bottom);
    if (missing.shoes) shopee_links.shoes = buildShopeeLink(missing.shoes);
    if (missing.outerwear) shopee_links.outerwear = buildShopeeLink(missing.outerwear);
    if (missing.accessories && missing.accessories.length) {
      shopee_links.accessories = missing.accessories.map(name => buildShopeeLink(name));
    }

    return {
      ...sug,
      missing_items: missing,
      shopee_links
    };
  });

  return {
    user_id: Number(userId),
    favorite_style: userProfile.favorite_style ?? null,
    event,
    season: season, // cái mình gửi cho AI (có thể null nếu để AI tự suy)
    suggestions: normalized
  };
}