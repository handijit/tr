import assertString from "../helpers/assert-string.helper";
import parsePhone from "../helpers/phone.helper";

/** Returns a Turkish phone number in E.164 form ("+905321234567"), or `null`. */
const normalizePhone = (value: string): string | null => {
  assertString(value, "normalizePhone");
  const phone = parsePhone(value);
  return phone === null ? null : `+90${phone.national}`;
};

export default normalizePhone;
