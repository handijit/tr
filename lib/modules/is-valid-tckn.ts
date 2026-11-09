import stripWhitespace from "../helpers/strip-whitespace.helper";

const TCKN_PATTERN = /^[1-9]\d{10}$/;
const DIGIT_ZERO = 48;

/** Checks the two check digits of a T.C. identity number (11 digits, the first not 0). */
const isValidTckn = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  const tckn = stripWhitespace(value);
  if (!TCKN_PATTERN.test(tckn)) return false;

  const digitAt = (index: number): number =>
    tckn.charCodeAt(index) - DIGIT_ZERO;
  const oddSum = digitAt(0) + digitAt(2) + digitAt(4) + digitAt(6) + digitAt(8);
  const evenSum = digitAt(1) + digitAt(3) + digitAt(5) + digitAt(7);
  // The subtraction can go below zero; a plain % would then hand back a negative digit.
  const tenth = (((oddSum * 7 - evenSum) % 10) + 10) % 10;
  const eleventh = (oddSum + evenSum + digitAt(9)) % 10;
  return digitAt(9) === tenth && digitAt(10) === eleventh;
};

export default isValidTckn;
