import cloudinary from "../config/cloudinary.js";
import { Success, BadRequest, InternalServerError, NotFound } from "../utils/responseHandler.utils.js";
import { updateClothingItemService } from "../service/clothingItem.service.js";

function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}
export async function uploadClothingItemImageController(req, res) {
  try {
    if (!req.file) return BadRequest(res, "Missing image file (field name: image)");

    const itemId = Number(req.params.item_id);
    if (!Number.isFinite(itemId)) return BadRequest(res, "Invalid item_id");

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "clothing-items",
      resource_type: "image",
      // format: "webp", // nếu bạn muốn ép format
      // transformation: [{ width: 1024, crop: "limit" }]
    });

    // Sau khi upload thành công -> lưu URL vào DB
    const updateRes = await updateClothingItemService(itemId, {
      image_url: result.secure_url
    });

    if (!updateRes || Number(updateRes.affectedRows) === 0) {
      // Không cập nhật được item (không tồn tại hoặc không có quyền)
      return NotFound(res, "Clothing item not found to update image_url");
    }

    // result.secure_url, result.public_id, result.width, result.height, ...
    return Success(res, {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      updated: true
    });
  } catch (err) {
    // Cloudinary thường trả message trong err.message
    return InternalServerError(res, err?.message);
  }
}