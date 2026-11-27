import { assertString } from "../helpers/assert.helper";
import { foldDiacritics, lowerTr } from "../helpers/turkish-case.helper";

const WHITESPACE_RUN = /\s+/g;

/** Normalizes text for search: "  IŞIK  Çağrı " → "isik cagri". Punctuation is kept. */
const foldTurkish = (text: string): string =>
  foldDiacritics(lowerTr(assertString(text, "foldTurkish", "text")))
    .replace(WHITESPACE_RUN, " ")
    .trim();

export default foldTurkish;
