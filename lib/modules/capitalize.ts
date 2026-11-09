import assertString from "../helpers/assert-string.helper";
import toUpperCase from "./to-upper-case";

/** Upper-cases the first letter by the Turkish rule and leaves the rest as written. */
const capitalize = (text: string): string => {
  assertString(text, "capitalize");
  const firstCodePoint = text.codePointAt(0);
  if (firstCodePoint === undefined) return "";

  // By code point, so a first character outside the BMP is not cut in half.
  const first = String.fromCodePoint(firstCodePoint);
  return toUpperCase(first) + text.slice(first.length);
};

export default capitalize;
