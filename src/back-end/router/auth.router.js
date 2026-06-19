import express from "express";
import { loginController } from "../controller/auth.controller.js";
import { authValidate } from "../validation/auth.validation.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/login", authValidate.login(), validate, loginController);

export default router;