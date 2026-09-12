import "dotenv/config";
import express from "express";
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => res.json({ ok: true }));


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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: "Internal Server Error" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
