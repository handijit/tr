const WHITESPACE = /\s+/g;
// A Turkish IBAN: "TR", two check digits and 24 digits (bank code, reserved digit, account).
const TR_IBAN_PATTERN = /^TR\d{24}$/;
// "TR" as ISO 13616 digits: T = 29, R = 27.
const TR_AS_DIGITS = "2927";

/** Checks a Turkish IBAN: 26 characters and the mod-97 check. Spaces and lower case are accepted. Non-strings → false. */
const isIban = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  const iban = value.replace(WHITESPACE, "").toUpperCase();
  if (!TR_IBAN_PATTERN.test(iban)) return false;

  // ISO 13616: move the country code and check digits to the end; a valid IBAN leaves remainder 1.
  // Folding digit by digit keeps every step far below Number.MAX_SAFE_INTEGER.
  const rearranged = iban.slice(4) + TR_AS_DIGITS + iban.slice(2, 4);
  let remainder = 0;
  for (let i = 0; i < rearranged.length; i++) {
    remainder = (remainder * 10 + rearranged.charCodeAt(i) - 48) % 97;
  }
  return remainder === 1;
};

export default isIban;
