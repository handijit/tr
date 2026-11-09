import {
  DEFAULT_TIME_ZONE,
  readCalendarDate,
  toDottedDate,
} from "../helpers/zoned-date.helper";
import type { TimeZoneOptions } from "../types";

/**
 * Writes a date as "dd.MM.yyyy". A `Date` or a timestamp is read in `timeZone`; a
 * "yyyy-MM-dd" string is a calendar date already and is written as it stands.
 */
const formatDate = (
  date: Date | number | string,
  { timeZone = DEFAULT_TIME_ZONE }: TimeZoneOptions = {}
): string => toDottedDate(readCalendarDate(date, timeZone, "formatDate"));

export default formatDate;
