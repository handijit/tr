import assertString from "../helpers/assert-string.helper";

// "İ" and its decomposed spelling "I" + combining dot above. The default mapping would turn
// "İ" into "i" followed by a stray combining dot.
const DOTTED_CAPITAL_I = /İ|İ/g;
const DOTLESS_CAPITAL_I = /I/g;

/** Lower-cases text by the Turkish rule: "I" becomes "ı" and "İ" becomes "i". */
const toLowerCase = (text: string): string => {
  assertString(text, "toLowerCase");
  return text
    .replace(DOTTED_CAPITAL_I, "i")
    .replace(DOTLESS_CAPITAL_I, "ı")
    .toLowerCase();
};

export default toLowerCase;
