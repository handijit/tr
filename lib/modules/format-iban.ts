import isIban from "./is-iban";

const WHITESPACE = /\s+/g;

/** Formats a valid Turkish IBAN in groups of four: "TR33 0006 1005 1978 6457 8413 26". Invalid → undefined. */
const formatIban = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !isIban(value)) return undefined;
  const iban = value.replace(WHITESPACE, "").toUpperCase();
  const groups: string[] = [];
  for (let i = 0; i < iban.length; i += 4) groups.push(iban.slice(i, i + 4));
  return groups.join(" ");
};

export default formatIban;
