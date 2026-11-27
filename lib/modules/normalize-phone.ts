const SEPARATORS = /[\s().-]/g;
// Optional country or trunk prefix, then a 10-digit national number. Turkish national numbers
// start with 2, 3 or 4 (landline), 5 (mobile) or 8 (850 and other non-geographic numbers).
const PHONE_PATTERN = /^(?:\+90|0090|90|0)?([2-58]\d{9})$/;

/** Normalizes a Turkish phone number to E.164: "0 (532) 123 45 67" → "+905321234567". Invalid → undefined. */
const normalizePhone = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const match = PHONE_PATTERN.exec(value.replace(SEPARATORS, ""));
  return match === null ? undefined : `+90${match[1]}`;
};

export default normalizePhone;
