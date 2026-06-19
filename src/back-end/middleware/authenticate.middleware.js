import jwt from "jsonwebtoken";
import { Unauthorized, BadRequest, InternalServerError } from "../utils/responseHandler.utils.js";

function getBearerToken(req) {
  const header = req.headers?.authorization;
  if (!header) return null;

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  return token.trim();
}

function getJwtSecret() {
  const base64Secret = process.env.JWT_SECRET;
  if (!base64Secret) return null;

  try {
    const buf = Buffer.from(base64Secret, "base64");
    if (!buf || buf.length < 32) return null;
    return buf;
  } catch {
    return null;
  }
}

export const authenticate = (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) return Unauthorized(res, "No token provided");

    const secret = getJwtSecret();
    if (!secret) return InternalServerError(res, "Missing/invalid JWT_SECRET");

    const decoded = jwt.verify(token, secret, { algorithms: ["HS512"] });

    const userId = decoded?.user_id;
    if (!userId) return Unauthorized(res, "Invalid token: missing user_id");

    req.user = { user_id: Number(userId) };
    return next();
  } catch (err) {
    if (err?.name === "TokenExpiredError") return Unauthorized(res, "Token expired");
    if (err?.name === "JsonWebTokenError") return Unauthorized(res, err.message || "Invalid token");
    return InternalServerError(res, err?.message + "nfiwefe" || "Server error");
  }
};

export default authenticate;