// Reference generators, written from the published definitions and deliberately not shared
// with lib/: every number in the tests is built here from a made-up stem, so no test carries
// a number copied from a real person or company.

const digitsOf = (text: string): number[] => [...text].map(Number);

/** Appends the two check digits to a nine-digit stem. */
const makeTckn = (stem: string): string => {
  const digits = digitsOf(stem);
  const odd = [0, 2, 4, 6, 8].reduce(
    (sum, i) => sum + (digits[i] as number),
    0
  );
  const even = [1, 3, 5, 7].reduce((sum, i) => sum + (digits[i] as number), 0);
  // "odd * 7 - even" and "odd * 7 + even * 9" are the same number modulo 10.
  const tenth = (odd * 7 + even * 9) % 10;
  const eleventh = (odd + even + tenth) % 10;
  return `${stem}${tenth}${eleventh}`;
};

/** Appends the check digit to a nine-digit stem. */
const makeVkn = (stem: string): string => {
  let sum = 0;
  digitsOf(stem).forEach((digit, index) => {
    const position = index + 1;
    const shifted = (digit + 10 - position) % 10;
    sum += shifted === 9 ? 9 : (shifted * 2 ** (10 - position)) % 9;
  });
  return `${stem}${(10 - (sum % 10)) % 10}`;
};

/** Builds a Turkish IBAN around a 22-digit BBAN (bank code, reserved digit, account). */
const makeIban = (bban: string): string => {
  // "T" is 29 and "R" is 27 in the ISO 13616 letter table; "00" stands in for the checksum.
  const remainder = BigInt(`${bban}292700`) % 97n;
  return `TR${String(98n - remainder).padStart(2, "0")}${bban}`;
};

const TCKN_STEMS = [
  "100000001",
  "123456789",
  "190909090",
  "999999999",
  "246813579",
  "500000000",
];
const VKN_STEMS = [
  "123456789",
  "000000001",
  "999999999",
  "111111111",
  "246813579",
  "909090909",
  "100000000",
];
const BBANS = [
  "0000000000000000000001",
  "0001000000000000000002",
  "0006200000000000000003",
  "9999999999999999999999",
  "1234567890123456789012",
];

const VALID_TCKNS = TCKN_STEMS.map(makeTckn);
const VALID_VKNS = VKN_STEMS.map(makeVkn);
const VALID_IBANS = BBANS.map(makeIban);

export { makeIban, makeTckn, makeVkn, VALID_IBANS, VALID_TCKNS, VALID_VKNS };
