import normalizePhone from "./normalize-phone";

/** Checks for a Turkish mobile number (national number starting with 5) in any form normalizePhone accepts. */
const isMobilePhone = (value: unknown): boolean =>
  normalizePhone(value)?.startsWith("+905") === true;

export default isMobilePhone;
