import type { PhoneType } from "../types";

const ALLOWED_CHARACTERS = /^\+?[\d\s().-]+$/;
const NON_DIGITS = /\D/g;
// With "+" the country code is mandatory; without it the trunk "0", "90" and "0090" are optional.
const INTERNATIONAL_DIGITS = /^90([2-58]\d{9})$/;
const DOMESTIC_DIGITS = /^(?:0090|90|0)?([2-58]\d{9})$/;

type ParsedPhone = {
  /** The ten-digit national number: area code and subscriber number. */
  national: string;
  /** What the first digit of the national number says about the line. */
  type: PhoneType;
};

const typeOf = (national: string): PhoneType => {
  const leadingDigit = national.charAt(0);
  if (leadingDigit === "5") return "mobile";
  if (leadingDigit === "8") return "nonGeographic";
  return "landline";
};

/** Reads a Turkish phone number in any common spelling, or returns `null`. */
const parsePhone = (value: string): ParsedPhone | null => {
  const trimmed = value.trim();
  if (!ALLOWED_CHARACTERS.test(trimmed)) return null;

  const digits = trimmed.replace(NON_DIGITS, "");
  const pattern = trimmed.startsWith("+")
    ? INTERNATIONAL_DIGITS
    : DOMESTIC_DIGITS;
  const national = pattern.exec(digits)?.[1];
  if (national === undefined) return null;

  return { national, type: typeOf(national) };
};

export type { ParsedPhone };
export default parsePhone;
