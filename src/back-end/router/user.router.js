import { userValidate } from '../validation/user.validation.js';
import { validate } from '../middleware/validate.middleware.js';
import { createUserController, updateUserController } from '../controller/user.controller.js';
import authenticate from '../middleware/authenticate.middleware.js';
import express from "express";

const router = express.Router();

router.post('/', userValidate.createUser(), createUserController);
router.put('/:user_id', authenticate, userValidate.updateUser(), updateUserController);

export default router;