import {
  DEFAULT_TIME_ZONE,
  readCalendarDate,
} from "../helpers/zoned-date.helper";
import type { TimeZoneOptions } from "../types";
import MONTH_NAMES from "./month-names";

/** Returns the Turkish name of the month a date falls in, such as "Kasım". */
const getMonthName = (
  date: Date | number | string,
  { timeZone = DEFAULT_TIME_ZONE }: TimeZoneOptions = {}
): string => {
  const { month } = readCalendarDate(date, timeZone, "getMonthName");
  return MONTH_NAMES[month - 1] as string;
};

export default getMonthName;
