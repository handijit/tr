import { TURKIYE_OFFSET_MS } from "../helpers/turkiye-time.helper";

// d.M.yyyy or dd.MM.yyyy; "/" is accepted too, but the two separators must match.
const DATE_PATTERN = /^(\d{1,2})([./])(\d{1,2})\2(\d{4})$/;

/** Reads "dd.MM.yyyy" as the start of that day in Türkiye time (UTC+03:00). Impossible dates → undefined. */
const parseDateTr = (text: unknown): Date | undefined => {
  if (typeof text !== "string") return undefined;
  const match = DATE_PATTERN.exec(text.trim());
  if (match === null) return undefined;
  const day = Number(match[1]);
  const month = Number(match[3]);
  const year = Number(match[4]);

  // setUTCFullYear, unlike Date.UTC, does not map the years 0–99 to 1900–1999.
  const utcMidnight = new Date(0);
  utcMidnight.setUTCFullYear(year, month - 1, day);
  // Date rolls 31.04 over to 01.05 and month 13 into the next year; a roll-over means "no such day".
  if (
    utcMidnight.getUTCDate() !== day ||
    utcMidnight.getUTCMonth() !== month - 1
  ) {
    return undefined;
  }
  return new Date(utcMidnight.getTime() - TURKIYE_OFFSET_MS);
};

export default parseDateTr;
