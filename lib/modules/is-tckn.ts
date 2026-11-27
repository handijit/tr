// Eleven digits, never starting with zero.
const TCKN_PATTERN = /^[1-9]\d{10}$/;

/** Checks a Turkish identity number (T.C. Kimlik No): format and both check digits. Non-strings → false. */
const isTckn = (value: unknown): boolean => {
  if (typeof value !== "string" || !TCKN_PATTERN.test(value)) return false;
  const digit = (index: number): number => value.charCodeAt(index) - 48;

  const oddSum = digit(0) + digit(2) + digit(4) + digit(6) + digit(8);
  const evenSum = digit(1) + digit(3) + digit(5) + digit(7);
  // The difference can be negative; the extra + 10 keeps the remainder in 0–9.
  const tenth = (((oddSum * 7 - evenSum) % 10) + 10) % 10;
  const eleventh = (oddSum + evenSum + digit(9)) % 10;
  return tenth === digit(9) && eleventh === digit(10);
};

export default isTckn;
