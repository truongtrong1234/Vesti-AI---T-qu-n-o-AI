import { body } from 'express-validator';
import { responseMsg } from '../constants/message.js';
import { regexAlphabetAndSpaceAndSymbol } from '../utils/validation.util.js';

export const get = field => body(field);

export const number = (field, min, max, required, fieldTitle = '') => {
  if (!field) return;
  const validation = body(field);

  if (required) validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));
  else validation.optional();

  validation.isInt({ min, max }).withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));
  return validation;
};

export const numberArr = (field, min, max, required, fieldTitle = '') => {
  if (!field) return;
  const validation = body(field);

  if (required) {
    validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));
    validation.custom(arr => arr.length > 0).withMessage('Array cannot be empty ' + (fieldTitle || field));
  } else validation.optional();

  validation.isArray().withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));
  validation.custom(value => {
    if (!value) return true;
    for (const item of value) {
      if (typeof item !== 'number') throw new Error(responseMsg.INVALID_FIELD + (fieldTitle || field));
      if (item < min || item > max) throw new Error(responseMsg.INVALID_FIELD + (fieldTitle || field));
    }
    return true;
  });
  return validation;
};

export const stringArr = (field, max, isStrict, required, fieldTitle = '') => {
  if (!field) return;
  const validation = body(field);

  if (required) {
    validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));
    validation.custom(arr => arr.length > 0).withMessage('Array cannot be empty ' + (fieldTitle || field));
  } else validation.optional();

  validation.isArray().withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));

  if (!isStrict) {
    validation.customSanitizer(value => {
      if (!Array.isArray(value)) return value;
      return value.map(item => (typeof item === 'string' ? item.trim() : item));
    });
  }

  validation.custom(value => {
    if (!value) return true;
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      if (typeof item !== 'string') throw new Error(responseMsg.INVALID_FIELD + (fieldTitle || field + ` - ${i}`));

      if (isStrict) {
        if (!regexAlphabetAndSpaceAndSymbol.test(item)) throw new Error(responseMsg.INVALID_FIELD + (fieldTitle || field + ` - ${i}`));
      }

      if (item.length > max) throw new Error(responseMsg.INVALID_FIELD + (fieldTitle || field + ` - ${i}`));
      if (item.length <= 0) throw new Error(responseMsg.INVALID_FIELD + (fieldTitle || field + ` - ${i}`));
    }
    return true;
  });
  return validation;
};

export const string = (field, max, required, sanitizer = null, fieldTitle = '') => {
  if (!field) return;
  const validation = body(field);

  if (required) validation.notEmpty().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));
  else validation.optional();

  validation.isLength({ max }).withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field + `(< ${max})`));
  if (sanitizer) validation.customSanitizer(sanitizer);

  return validation;
};

export const strictString = (field, max, regex, required, fieldTitle = '') => {
  if (!field) return;
  const validation = body(field);

  if (required) validation.notEmpty().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));
  else validation.optional();

  validation.matches(regex).withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));
  validation.isLength({ max }).withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field + `(< ${max})`));

  return validation;
};

export const url = (field, max, required, fieldTitle = '') => {
  if (!field) return;
  const validation = body(field);

  if (required) validation.notEmpty().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));
  else validation.optional();

  validation.isLength({ max }).withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field + `(< ${max})`));
  validation.isURL().withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));

  return validation;
};

export const enumerate = (field, values, required, fieldTitle = '') => {
  if (!field) return;
  const validation = body(field);

  if (required) validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));
  else validation.optional();

  validation.isIn(values).withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));

  return validation;
};

export const bool = (field, required, fieldTitle = '') => {
  if (!field) return;
  const validation = body(field);

  if (required) validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));
  else validation.optional();

  validation.isBoolean().withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));

  return validation;
};

export const email = (field, max, required, fieldTitle = '') => {
  if (!field) return;
  const validation = body(field);

  if (required) validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));
  else validation.optional();

  validation.isEmail().withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));
  validation.isLength({ max }).withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field + `(< ${max})`));

  return validation;
};
