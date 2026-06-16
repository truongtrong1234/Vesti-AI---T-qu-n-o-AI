import { param } from 'express-validator';
import { responseMsg } from '../constants/message.js';

export const number = (field, min, max, required, fieldTitle) => {
  if (typeof field !== 'string' || field.trim() === '') return;
  const validation = param(field);

  if (required) validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));
  else validation.optional();

  validation
    .toInt()
    .isInt({ min, max })
    .withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));
  return validation;
};
