import isRealDate from "./calendar.helper";
import describeValue from "./describe-value.helper";
import padNumber from "./pad-number.helper";

type CalendarDate = {
  /** Calendar year, 1 to 9999. */
  year: number;
  /** Month of the year, 1 to 12. */
  month: number;
  /** Day of the month, 1 to 31. */
  day: number;
};

type CalendarDateTime = CalendarDate & {
  /** Hour of the day, 0 to 23. */
  hour: number;
  /** Minute of the hour, 0 to 59. */
  minute: number;
};

const DEFAULT_TIME_ZONE = "Europe/Istanbul";
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
// 0001-01-02T00:00Z and 9999-12-30T23:59:59.999Z. The one-day margin keeps the year inside
// 1 to 9999 in every time zone, so the text never needs an era or a fifth year digit.
const MIN_TIMESTAMP = -62135510400000;
const MAX_TIMESTAMP = 253402214399999;
// Building an Intl.DateTimeFormat costs far more than using one, so they are reused; the cap
// keeps a caller that walks every zone from growing the cache without bound.
const MAX_CACHED_FORMATTERS = 8;
const MAX_ECHOED_LENGTH = 32;

const formatters = /* @__PURE__ */ new Map<string, Intl.DateTimeFormat>();

const getFormatter = (
  timeZone: string,
  source: string
): Intl.DateTimeFormat => {
  const cached = formatters.get(timeZone);
  if (cached !== undefined) return cached;

  let formatter: Intl.DateTimeFormat;
  try {
    // Intl only moves the instant into the zone; the fixed locale, calendar, digits and hour
    // cycle make the parts plain numbers that read the same on every engine.
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      calendar: "gregory",
      numberingSystem: "latn",
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    throw new RangeError(
      `${source}: unknown time zone "${timeZone.slice(0, MAX_ECHOED_LENGTH)}", expected an IANA name like "Europe/Istanbul"`
    );
  }

  if (formatters.size >= MAX_CACHED_FORMATTERS) {
    formatters.delete(formatters.keys().next().value as string);
  }
  formatters.set(timeZone, formatter);
  return formatter;
};

const toTimestamp = (date: unknown, source: string): number => {
  let timestamp: number;
  if (typeof date === "number") {
    timestamp = date;
  } else {
    try {
      // Reads the internal time value, so a Date from another realm (an iframe, an Electron
      // context) passes and a look-alike object does not.
      timestamp = Date.prototype.getTime.call(date);
    } catch {
      throw new TypeError(
        `${source}: expected a Date or a timestamp in milliseconds, received ${describeValue(date)}`
      );
    }
  }

  if (Number.isNaN(timestamp)) {
    throw new RangeError(`${source}: received an invalid date`);
  }
  if (timestamp < MIN_TIMESTAMP || timestamp > MAX_TIMESTAMP) {
    throw new RangeError(
      `${source}: the date is outside the supported years 0001 to 9999`
    );
  }
  return timestamp;
};

/** Reads the wall-clock date and time an instant has in a time zone. */
const readInstant = (
  date: unknown,
  timeZone: unknown,
  source: string
): CalendarDateTime => {
  const timestamp = toTimestamp(date, source);
  if (typeof timeZone !== "string") {
    throw new TypeError(
      `${source}: expected timeZone to be a string, received ${describeValue(timeZone)}`
    );
  }

  const fields: Record<string, string> = {};
  for (const part of getFormatter(timeZone, source).formatToParts(timestamp)) {
    fields[part.type] = part.value;
  }
  return {
    year: Number(fields.year),
    month: Number(fields.month),
    day: Number(fields.day),
    hour: Number(fields.hour),
    minute: Number(fields.minute),
  };
};

/**
 * Reads a calendar date: a "yyyy-MM-dd" string is taken as written (a business date has no
 * time zone), anything else is an instant read in `timeZone`.
 */
const readCalendarDate = (
  date: unknown,
  timeZone: unknown,
  source: string
): CalendarDate => {
  if (typeof date !== "string") return readInstant(date, timeZone, source);

  const match = ISO_DATE_PATTERN.exec(date);
  if (match !== null) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (isRealDate(year, month, day)) return { year, month, day };
  }
  throw new RangeError(
    `${source}: expected a real calendar date like "2026-11-10", received "${date.slice(0, MAX_ECHOED_LENGTH)}"`
  );
};

/** Writes a calendar date as "dd.MM.yyyy". */
const toDottedDate = ({ year, month, day }: CalendarDate): string =>
  `${padNumber(day, 2)}.${padNumber(month, 2)}.${padNumber(year, 4)}`;

export type { CalendarDate, CalendarDateTime };
export { DEFAULT_TIME_ZONE, readCalendarDate, readInstant, toDottedDate };
