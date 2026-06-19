import { loginService } from "../service/auth.service.js";
import { Success, Unauthorized, BadRequest, InternalServerError } from "../utils/responseHandler.utils.js";

export async function loginController(req, res) {
  try {
    const email = String(req.body?.email || "").trim();
    const password = String(req.body?.password || "");

    if (!email || !password) return BadRequest(res, "Missing email or password");

    const result = await loginService(email, password);
    if (!result) return Unauthorized(res, "Invalid credentials");

    return Success(res, { ok: true, data: result });
  } catch (err) {
    return InternalServerError(res, err?.message);
  }
}