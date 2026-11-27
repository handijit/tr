import normalizePhone from "./normalize-phone";

/** Formats a Turkish phone number for display: "+905321234567" → "0532 123 45 67". Invalid → undefined. */
const formatPhone = (value: unknown): string | undefined => {
  const e164 = normalizePhone(value);
  if (e164 === undefined) return undefined;
  return `0${e164.slice(3, 6)} ${e164.slice(6, 9)} ${e164.slice(9, 11)} ${e164.slice(11)}`;
};

export default formatPhone;
