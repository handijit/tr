import parsePhone from "../helpers/phone.helper";

/** Checks that a value is a Turkish mobile, landline or 8XX service number. */
const isValidPhone = (value: unknown): boolean =>
  typeof value === "string" && parsePhone(value) !== null;

export default isValidPhone;
