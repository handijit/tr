import assertString from "../helpers/assert-string.helper";
import toLowerCase from "./to-lower-case";

// The 29 letters in dictionary order, with q, w and x where Latin loanwords put them.
const ALPHABET = "abcçdefgğhıijklmnoöpqrsştuüvwxyz";
const COMBINING_MARK = /\p{M}/u;
const FIRST_NON_ASCII = 128;
const DIGIT_ZERO = 48;
const DIGIT_NINE = 57;
// Weight bands: ASCII punctuation, then digits, then letters, then every other character.
const DIGIT_BAND = 1_000;
const LETTER_BAND = 2_000;
const OTHER_BAND = 3_000;
// A combining mark that survived composition weighs nothing at the letter level.
const IGNORED = -1;

const weightOf = (character: string): number => {
  const rank = ALPHABET.indexOf(character);
  if (rank >= 0) return LETTER_BAND + rank;

  const codePoint = character.codePointAt(0) as number;
  if (codePoint < FIRST_NON_ASCII) {
    return codePoint >= DIGIT_ZERO && codePoint <= DIGIT_NINE
      ? DIGIT_BAND + codePoint
      : codePoint;
  }
  if (COMBINING_MARK.test(character)) return IGNORED;

  // An accented letter sorts with its base letter ("â" with "a"); the accent only breaks ties.
  const baseRank = ALPHABET.indexOf(character.normalize("NFD").charAt(0));
  return baseRank >= 0 ? LETTER_BAND + baseRank : OTHER_BAND + codePoint;
};

const weigh = (text: string): number[] => {
  const weights: number[] = [];
  for (const character of text) {
    const weight = weightOf(character);
    if (weight !== IGNORED) weights.push(weight);
  }
  return weights;
};

// "0" for a character that is already lower case, "1" otherwise: lower case sorts first.
const caseKeyOf = (text: string): string => {
  let caseKey = "";
  for (const character of text) {
    caseKey += toLowerCase(character) === character ? "0" : "1";
  }
  return caseKey;
};

/**
 * Compares two texts in Turkish alphabetical order ("ç" after "c", "ı" before "i") for
 * `Array.prototype.sort`; case and accents only break ties, lower case first.
 */
const compareTurkish = (left: string, right: string): number => {
  assertString(left, "compareTurkish");
  assertString(right, "compareTurkish");

  // Composed form, so "ö" typed as "o" + diaeresis is the same letter.
  const leftText = left.normalize("NFC");
  const rightText = right.normalize("NFC");
  if (leftText === rightText) return 0;

  const leftLower = toLowerCase(leftText);
  const rightLower = toLowerCase(rightText);
  const leftWeights = weigh(leftLower);
  const rightWeights = weigh(rightLower);
  const sharedLength = Math.min(leftWeights.length, rightWeights.length);
  for (let i = 0; i < sharedLength; i += 1) {
    const difference = (leftWeights[i] as number) - (rightWeights[i] as number);
    if (difference !== 0) return difference < 0 ? -1 : 1;
  }
  if (leftWeights.length !== rightWeights.length) {
    return leftWeights.length < rightWeights.length ? -1 : 1;
  }

  // Same letters. An accent decides next ("kar" before "kâr"), then case ("ali" before "Ali").
  if (leftLower !== rightLower) return leftLower < rightLower ? -1 : 1;
  const leftCase = caseKeyOf(leftText);
  const rightCase = caseKeyOf(rightText);
  if (leftCase !== rightCase) return leftCase < rightCase ? -1 : 1;
  // Two capital forms of one letter ("Ǆ" and "ǅ"): code units keep the order total.
  return leftText < rightText ? -1 : 1;
};

export default compareTurkish;
