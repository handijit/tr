import { describeType } from "../helpers/assert.helper";
import { TURKIYE_OFFSET_MS } from "../helpers/turkiye-time.helper";

const pad = (value: number, length: number): string =>
  String(value).padStart(length, "0");

/** Formats a Date or epoch milliseconds as "dd.MM.yyyy" in Türkiye time (UTC+03:00). */
const formatDateTr = (date: Date | number): string => {
  let time: number;
  // The tag check also accepts a Date from another realm (iframe, vm), where instanceof fails.
  if (Object.prototype.toString.call(date) === "[object Date]") {
    time = Date.prototype.getTime.call(date);
  } else if (typeof date === "number") {
    time = date;
  } else {
    throw new TypeError(
      `formatDateTr: expected a Date or epoch milliseconds, received ${describeType(date)}`
    );
  }

  const shifted = new Date(time + TURKIYE_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  // NaN (an invalid date) fails both comparisons, as does a year "yyyy" cannot hold.
  if (!(year >= 0 && year <= 9999)) {
    throw new RangeError(
      `formatDateTr: expected a valid date between the years 0 and 9999, received ${String(date)}`
    );
  }
  return `${pad(shifted.getUTCDate(), 2)}.${pad(shifted.getUTCMonth() + 1, 2)}.${pad(year, 4)}`;
};

export default formatDateTr;
