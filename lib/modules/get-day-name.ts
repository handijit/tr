import {
  DEFAULT_TIME_ZONE,
  readCalendarDate,
} from "../helpers/zoned-date.helper";
import type { TimeZoneOptions } from "../types";
import DAY_NAMES from "./day-names";

/** Returns the Turkish name of the day of the week a date falls on, such as "Salı". */
const getDayName = (
  date: Date | number | string,
  { timeZone = DEFAULT_TIME_ZONE }: TimeZoneOptions = {}
): string => {
  const { year, month, day } = readCalendarDate(date, timeZone, "getDayName");
  // setUTCFullYear, because Date.UTC reads the years 0 to 99 as 1900 to 1999.
  const calendarDay = new Date(0);
  calendarDay.setUTCFullYear(year, month - 1, day);
  // getUTCDay counts from Sunday, DAY_NAMES from Monday.
  return DAY_NAMES[(calendarDay.getUTCDay() + 6) % 7] as string;
};

export default getDayName;
