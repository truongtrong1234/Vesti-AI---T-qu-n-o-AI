import { userValidate } from '../validation/user.validation.js';
import { validate } from '../middleware/validate.middleware.js';
import { createUserController, updateUserController, listUsersController, getUserByIdController } from '../controller/user.controller.js';
import authenticate from '../middleware/authenticate.middleware.js';
import express from "express";

const router = express.Router();

router.get('/', authenticate, userValidate.listUsers(), validate, listUsersController);
router.post('/', userValidate.createUser(), createUserController);
router.put('/:user_id', authenticate, userValidate.updateUser(), updateUserController);
router.get('/:user_id', authenticate, userValidate.getById(), validate, getUserByIdController);
export default router;