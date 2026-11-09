import stripWhitespace from "../helpers/strip-whitespace.helper";

const VKN_PATTERN = /^\d{10}$/;
const DIGIT_ZERO = 48;

/** Checks the check digit of a tax identification number (VKN, 10 digits). */
const isValidVkn = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  const vkn = stripWhitespace(value);
  if (!VKN_PATTERN.test(vkn)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    const shifted = (vkn.charCodeAt(i) - DIGIT_ZERO + 9 - i) % 10;
    const weighted = (shifted * 2 ** (9 - i)) % 9;
    // A shifted 9 is a multiple of nine; the algorithm counts it as 9, not as 0.
    sum += shifted !== 0 && weighted === 0 ? 9 : weighted;
  }
  return (10 - (sum % 10)) % 10 === vkn.charCodeAt(9) - DIGIT_ZERO;
};

export default isValidVkn;
