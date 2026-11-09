import parseIban from "../helpers/iban.helper";

/** Checks a Turkish IBAN: "TR", 24 digits and the ISO 13616 mod-97 checksum. */
const isValidIban = (value: unknown): boolean =>
  typeof value === "string" && parseIban(value) !== null;

export default isValidIban;
