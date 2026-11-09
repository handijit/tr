import assertString from "../helpers/assert-string.helper";
import parsePhone from "../helpers/phone.helper";
import type { PhoneType } from "../types";

/** Tells a mobile number (5XX) from a landline (2XX to 4XX) and a service number (8XX), or returns `null`. */
const getPhoneType = (value: string): PhoneType | null => {
  assertString(value, "getPhoneType");
  return parsePhone(value)?.type ?? null;
};

export default getPhoneType;
