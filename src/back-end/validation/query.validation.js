import { query } from 'express-validator';
import { responseMsg } from '../constants/message.js';
import { regexAlphabetAndSpaceAndSymbol } from '../utils/validation.util.js';
import moment from 'moment';

export const page = () => {
  return query('page').optional().toInt().isInt({ min: 0, max: 100000 }).withMessage(responseMsg.PAGE_INVALID);
};
export const pageSize = () => {
  return query('size').optional().toInt().isInt({ min: 0, max: 100000 }).withMessage(responseMsg.PAGE_SIZE_INVALID);
};

export const sortBy = whitelist => {
  return query('sortBy').optional().isIn(whitelist).withMessage(responseMsg.ORDER_BY_INVALID);
};

export const sortOrder = () => {
  return query('sortOrder').optional().isIn(['DESC']).withMessage(responseMsg.ORDER_BY_INVALID);
};

export const string = (field, max, required, fieldTitle) => {
  const validation = query(field);
  if (typeof field !== 'string' || field.trim() === '') return;

  if (!required) validation.optional();
  else validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));

  validation.custom(value => {
    if (value !== null && value !== '') {
      if (!regexAlphabetAndSpaceAndSymbol.test(value)) throw new Error(responseMsg.INVALID_FIELD + (fieldTitle || field));
      if (value.length > 255) throw new Error(responseMsg.INVALID_FIELD + (fieldTitle || field + `(< ${max})`));
    }
    return true;
  });
  validation.escape();

  return validation;
};

export const number = (field, min, max, required, fieldTitle) => {
  const validation = query(field);
  if (typeof field !== 'string' || field.trim() === '') return;

  if (!required) validation.optional();
  else validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));

  validation
    .toInt()
    .isInt({ min, max })
    .withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));

  return validation;
};

export const enumerate = (field, values, required, fieldTitle, isNumber) => {
  const validation = query(field);
  if (typeof field !== 'string' || field.trim() === '') return;

  if (!required) validation.optional();
  else validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));

  if (isNumber) validation.toInt();
  validation.isIn(values).withMessage(responseMsg.INVALID_FIELD + (fieldTitle || field));

  return validation;
};

export const datetime = (field, format, required, fieldTitle) => {
  const validation = query(field);
  if (typeof field !== 'string' || field.trim() === '') return;

  if (!required) validation.optional();
  else validation.exists().withMessage(responseMsg.MISSING_FIELD + (fieldTitle || field));

  validation.custom(value => {
    if (!moment(value, format, true).isValid()) {
      throw new Error(responseMsg.INVALID_FIELD + (fieldTitle || field + ` (${format})`));
    }
    return true;
  });

  return validation;
};
