import assertString from "../helpers/assert-string.helper";
import isRealDate from "../helpers/calendar.helper";
import padNumber from "../helpers/pad-number.helper";

const DOTTED_DATE_PATTERN = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;

/**
 * Reads a "dd.MM.yyyy" date into the ISO calendar date "yyyy-MM-dd", or returns `null` when
 * the text is not a date or names a day that does not exist (31.02.2026).
 */
const parseDate = (text: string): string | null => {
  assertString(text, "parseDate");

  const match = DOTTED_DATE_PATTERN.exec(text.trim());
  if (match === null) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (!isRealDate(year, month, day)) return null;

  return `${padNumber(year, 4)}-${padNumber(month, 2)}-${padNumber(day, 2)}`;
};

export default parseDate;
