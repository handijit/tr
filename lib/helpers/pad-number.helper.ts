/** Left-pads a non-negative whole number with zeros: (7, 2) → "07". */
const padNumber = (value: number, length: number): string =>
  String(value).padStart(length, "0");

export default padNumber;
