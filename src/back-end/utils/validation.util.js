
export function validatePageSize(pageSize) {
  const minSize = 1; // Minimum allowed page size
  const maxSize = 100; // Maximum allowed page size
  return Number.isInteger(pageSize) && pageSize >= minSize && pageSize <= maxSize;
}

export function validateStringParam(name) {
  // Check if the name matches the regex
  return regexAlphabetAndSpaceAndSymbol.test(name);
}

export function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

/**
 * @param{string} time
 * */
export function validateTime(time) {
  return timeRegex.test(time);
}

export const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const stringRegex = /^[\p{L}\p{N}\p{Emoji}\p{So}()<>\[\]{}\-\\\/_:.,!?=\s'"“”‘’*#@]+$/u;

export const regexAlphabetAndSpace = /^[\p{L}\p{N}\s]+$/u;
export const regexAlphabetAndSpaceAndSymbol = /^[\p{L}\p{N}\p{S}\s\p{P}]+$/u;
export const regexAlphabetAndSymbol = /^[\p{L}\p{N}\p{S}\p{P}]+$/u;
export const regexAlphabetSnakecase = /^[a-z]+(_[a-z]+)*$/;
