import assertString from "../helpers/assert-string.helper";
import toLowerCase from "./to-lower-case";
import toUpperCase from "./to-upper-case";

// A letter that starts a word: nothing before it, or something that is not a letter, a digit,
// a combining mark (a decomposed "ü" must not split its word) or an apostrophe ("Ankara'da").
const WORD_START = /(?<![\p{L}\p{N}\p{M}'’])\p{L}/gu;

/** Writes every word with a Turkish upper-case first letter and lower-case rest. */
const toTitleCase = (text: string): string => {
  assertString(text, "toTitleCase");
  return toLowerCase(text).replace(WORD_START, toUpperCase);
};

export default toTitleCase;
