const VKN_PATTERN = /^\d{10}$/;

/** Checks a Turkish tax number (Vergi Kimlik No): ten digits and the check digit. Non-strings → false. */
const isVkn = (value: unknown): boolean => {
  if (typeof value !== "string" || !VKN_PATTERN.test(value)) return false;
  const digit = (index: number): number => value.charCodeAt(index) - 48;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const shifted = (digit(i) + 9 - i) % 10;
    let weighted = (shifted * 2 ** (9 - i)) % 9;
    // The published algorithm counts a non-zero multiple of 9 as 9, not 0.
    if (shifted !== 0 && weighted === 0) weighted = 9;
    sum += weighted;
  }
  return (10 - (sum % 10)) % 10 === digit(9);
};

export default isVkn;
