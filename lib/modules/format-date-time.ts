import padNumber from "../helpers/pad-number.helper";
import {
  DEFAULT_TIME_ZONE,
  readInstant,
  toDottedDate,
} from "../helpers/zoned-date.helper";
import type { TimeZoneOptions } from "../types";

/** Writes an instant as "dd.MM.yyyy HH:mm" on the 24-hour clock of `timeZone`. */
const formatDateTime = (
  date: Date | number,
  { timeZone = DEFAULT_TIME_ZONE }: TimeZoneOptions = {}
): string => {
  const instant = readInstant(date, timeZone, "formatDateTime");
  return `${toDottedDate(instant)} ${padNumber(instant.hour, 2)}:${padNumber(instant.minute, 2)}`;
};

export default formatDateTime;
