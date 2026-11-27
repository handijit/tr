/**
 * Optional minus, optional "₺", then lira either grouped with dots ("1.234.567") or plain
 * ("1234567"), an optional comma with one or two kuruş digits, and an optional "₺" / "TL" / "TRY".
 */
const AMOUNT_PATTERN =
  /^(-)?\s*(?:₺\s*)?(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?\s*(?:₺|TL|TRY)?$/i;

/** Reads a Turkish-formatted lira amount as integer kuruş: "1.234,56" → 123456; anything else → undefined. */
const parseLira = (text: unknown): number | undefined => {
  if (typeof text !== "string") return undefined;
  const match = AMOUNT_PATTERN.exec(text.trim());
  if (match === null) return undefined;
  // The lira group is mandatory in the pattern, so it is always present on a match.
  const lira = match[2] as string;
  const kurus = match[3] ?? "";

  const amount =
    BigInt(lira.replaceAll(".", "")) * 100n + BigInt(kurus.padEnd(2, "0"));
  const result = Number(match[1] === undefined ? amount : -amount);
  // An amount a number cannot hold exactly is rejected rather than silently rounded.
  return Number.isSafeInteger(result) ? result : undefined;
};

export default parseLira;
