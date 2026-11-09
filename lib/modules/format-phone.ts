import assertString from "../helpers/assert-string.helper";
import parsePhone from "../helpers/phone.helper";

type FormatPhoneOptions = {
  /** "national" writes "0 (532) 123 45 67", "international" writes "+90 532 123 45 67". Defaults to "national". */
  style?: "national" | "international";
};

/** Returns a Turkish phone number in its printed form, or `null`. */
const formatPhone = (
  value: string,
  { style = "national" }: FormatPhoneOptions = {}
): string | null => {
  assertString(value, "formatPhone");
  const phone = parsePhone(value);
  if (phone === null) return null;

  const areaCode = phone.national.slice(0, 3);
  const subscriber = `${phone.national.slice(3, 6)} ${phone.national.slice(6, 8)} ${phone.national.slice(8)}`;
  // Any style other than "international" is the documented default, never a third layout.
  return style === "international"
    ? `+90 ${areaCode} ${subscriber}`
    : `0 (${areaCode}) ${subscriber}`;
};

export type { FormatPhoneOptions };
export default formatPhone;
