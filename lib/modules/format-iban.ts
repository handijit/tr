import assertString from "../helpers/assert-string.helper";
import parseIban from "../helpers/iban.helper";

const FOUR_CHARACTERS = /.{4}(?=.)/g;

/** Returns a valid Turkish IBAN in printed groups of four ("TR33 0006 1005 …"), or `null`. */
const formatIban = (value: string): string | null => {
  assertString(value, "formatIban");
  const iban = parseIban(value);
  return iban === null ? null : iban.replace(FOUR_CHARACTERS, "$& ");
};

export default formatIban;
