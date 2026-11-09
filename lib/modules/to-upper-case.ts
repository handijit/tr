import assertString from "../helpers/assert-string.helper";

const DOTTED_SMALL_I = /i/g;

/** Upper-cases text by the Turkish rule: "i" becomes "İ" and "ı" becomes "I". */
const toUpperCase = (text: string): string => {
  assertString(text, "toUpperCase");
  // Only the dotted "i" differs from the default mapping ("ı" already maps to "I"), so the
  // result does not depend on the locale data the engine was built with.
  return text.replace(DOTTED_SMALL_I, "İ").toUpperCase();
};

export default toUpperCase;
