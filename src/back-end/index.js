import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./router/user.router.js";
import authRouter from "./router/auth.router.js";
import clothingItemRouter from "./router/clothingItem.router.js";
import itemEventsRouter from "./router/itemEvents.router.js";
import itemMaterialsRouter from "./router/itemMaterials.router.js";
import itemSeasonsRouter from "./router/itemSeasons.router.js";
import materialRouter from "./router/material.router.js";
import outfitRouter from "./router/outfit.router.js";
import outfitItemsRouter from "./router/outfitItems.router.js";
import packageRouter from "./router/package.router.js";
import packageItemsRouter from "./router/packageItems.router.js";
import packageOutfitsRouter from "./router/packageOutfits.router.js";
import aiSuggestRouter from "./router/aiSuggest.router.js";

const app = express();

// Thiết lập __dirname cho ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn tuyệt đối tới thư mục dist sau khi build Vite
// Điều chỉnh lại nếu cấu trúc khác (ví dụ: path.join(__dirname, "../frontend/dist"))
const distPath = path.join(__dirname, "../dist");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => res.json({ ok: true }));

// API routes
app.use("/item-events", itemEventsRouter);
app.use("/item-materials", itemMaterialsRouter);
app.use("/item-seasons", itemSeasonsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/clothing-items", clothingItemRouter);
app.use("/api/materials", materialRouter);
app.use("/api/outfits", outfitRouter);
app.use("/api/outfit-items", outfitItemsRouter);
app.use("/api/packages", packageRouter);
app.use("/api/package-items", packageItemsRouter);
app.use("/api/package-outfits", packageOutfitsRouter);
app.use("/api/ai-suggest", aiSuggestRouter);

// Serve static files (frontend)
app.use(express.static(distPath));
// Fallback cho SPA: mọi route khác (không phải /api/...) trả về index.html
app.get(/^(?!\/api\/)/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: "Internal Server Error" });
});

// Nếu vẫn muốn route root text đơn giản thì để sau static/fallback
// nhưng khi đã dùng SPA thường không cần nữa
// app.get("/", (req, res) => {
//   res.send("Vesti Backend is running!");
// });

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});