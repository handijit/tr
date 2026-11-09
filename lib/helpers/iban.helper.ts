import stripWhitespace from "./strip-whitespace.helper";

const TR_IBAN_PATTERN = /^TR\d{24}$/;
// "TR" as IBAN letter values: T = 29, R = 27.
const COUNTRY_DIGITS = "2927";
const DIGIT_ZERO = 48;

/** Returns the compact upper-case form of a valid Turkish IBAN, or `null`. */
const parseIban = (value: string): string | null => {
  const iban = stripWhitespace(value).toUpperCase();
  if (!TR_IBAN_PATTERN.test(iban)) return null;

  // ISO 13616: move the first four characters to the end and read the result as one number mod 97.
  // The number has 30 digits, so the remainder is carried digit by digit instead of parsing it.
  const rearranged = `${iban.slice(4)}${COUNTRY_DIGITS}${iban.slice(2, 4)}`;
  let remainder = 0;
  for (let i = 0; i < rearranged.length; i += 1) {
    remainder = (remainder * 10 + rearranged.charCodeAt(i) - DIGIT_ZERO) % 97;
  }
  return remainder === 1 ? iban : null;
};

export default parseIban;
