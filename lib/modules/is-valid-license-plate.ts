// Province code 01 to 81, then one of the six civil layouts: one letter with four or five
// digits, two letters with three or four, three letters with two or three. Plates use the
// 23 letters left after Ç, Ğ, İ, Ö, Ş, Ü and Q, W, X are taken out.
const LICENSE_PLATE_PATTERN =
  /^(?:0[1-9]|[1-7]\d|8[01])\s*(?:[A-PR-VYZa-pr-vyz]\s*\d{4,5}|[A-PR-VYZa-pr-vyz]{2}\s*\d{3,4}|[A-PR-VYZa-pr-vyz]{3}\s*\d{2,3})$/;

/**
 * Checks that a value has the shape of a civil Turkish licence plate ("34 ABC 123"). Only
 * the shape is checked: whether the plate was ever issued is not something a format can tell.
 */
const isValidLicensePlate = (value: unknown): boolean =>
  typeof value === "string" && LICENSE_PLATE_PATTERN.test(value.trim());

export default isValidLicensePlate;
