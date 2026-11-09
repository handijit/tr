import assertString from "../helpers/assert-string.helper";
import parseIban from "../helpers/iban.helper";

/** Returns the storage form of a valid Turkish IBAN (upper case, no spaces), or `null`. */
const normalizeIban = (value: string): string | null => {
  assertString(value, "normalizeIban");
  return parseIban(value);
};

export default normalizeIban;
