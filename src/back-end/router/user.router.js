import { userValidate } from '../validation/user.validation.js';
import { validate } from '../middleware/validate.middleware.js';
import { createUserController, updateUserController } from '../controller/user.controller.js';
import express from "express";

const router = express.Router();

router.post('/', userValidate.createUser(), validate, createUserController);
router.put('/:id', userValidate.updateUser(), validate, updateUserController);

export default router;