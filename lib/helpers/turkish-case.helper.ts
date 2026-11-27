// "İ" may also arrive decomposed as "I" + combining dot above (U+0307).
const DOTTED_CAPITAL_I = /İ|İ/g;
const DOTLESS_CAPITAL_I = /I/g;
const DOTTED_SMALL_I = /i/g;
const DOTLESS_SMALL_I = /ı/g;
const COMBINING_MARKS = /\p{M}/gu;

/** Lower-cases with Turkish rules (I → ı, İ → i) regardless of the runtime's default locale. */
const lowerTr = (text: string): string =>
  text
    .replace(DOTTED_CAPITAL_I, "i")
    .replace(DOTLESS_CAPITAL_I, "ı")
    .toLowerCase();

/** Upper-cases with Turkish rules (i → İ, ı → I) regardless of the runtime's default locale. */
const upperTr = (text: string): string =>
  text.replace(DOTTED_SMALL_I, "İ").replace(DOTLESS_SMALL_I, "I").toUpperCase();

/**
 * Strips diacritics from lower-cased text: ç→c ğ→g ı→i ö→o ş→s ü→u â→a î→i û→u (and é, ñ...).
 * Canonical decomposition splits each letter from its mark; "ı" has no decomposition of its own.
 */
const foldDiacritics = (lowerText: string): string =>
  lowerText
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(DOTLESS_SMALL_I, "i");

export { foldDiacritics, lowerTr, upperTr };
