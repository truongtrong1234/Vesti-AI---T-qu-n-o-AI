import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserToLogin } from "../database/user.database.js";

export async function loginService(email, password) {
  const emailNorm = String(email || "").trim().toLowerCase();
  const passwordStr = String(password || "");

  if (!emailNorm || !passwordStr) {
    throw new Error("MISSING_EMAIL_OR_PASSWORD");
  }
  const user = await getUserToLogin(emailNorm);
  if (!user || !user.password) {
    throw new Error("CREDENTIAL_INVALID");
  }
  const ok = await bcrypt.compare(passwordStr, user.password);
  if (!ok) throw new Error("CREDENTIAL_INVALID");

  const secret = Buffer.from(process.env.JWT_SECRET || "<JWT_SECRET>", "base64");
  return {
    token: jwt.sign({ user_id: Number(user.user_id) }, secret, {
      algorithm: "HS512",
      expiresIn: "12h"
    })
  };
}