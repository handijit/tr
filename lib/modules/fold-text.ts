import assertString from "../helpers/assert-string.helper";
import toLowerCase from "./to-lower-case";

const DOTLESS_SMALL_I = /ı/g;
const COMBINING_MARKS = /[̀-ͯ]/g;

/** Folds text to a search key: Turkish lower case, then "ç ğ ı ö ş ü" and accents to plain letters. */
const foldText = (text: string): string => {
  assertString(text, "foldText");
  // "ı" has no decomposition, so it is mapped by hand; the other letters lose their marks.
  return toLowerCase(text)
    .replace(DOTLESS_SMALL_I, "i")
    .normalize("NFD")
    .replace(COMBINING_MARKS, "");
};

export default foldText;
