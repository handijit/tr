import { describe, expect, test } from "vitest";

import formatDateTime from "../lib/modules/format-date-time";
import type { TimeZoneOptions } from "../lib/types";
import NON_DATES from "./support/non-dates";

const AFTERNOON = new Date("2026-11-10T11:30:00Z");

describe("formatDateTime", () => {
  test("should write date and time on the Istanbul clock by default", () => {
    expect(formatDateTime(AFTERNOON)).toBe("10.11.2026 14:30");
    expect(formatDateTime(AFTERNOON, {})).toBe("10.11.2026 14:30");
    expect(formatDateTime(AFTERNOON, { timeZone: undefined })).toBe(
      "10.11.2026 14:30"
    );
  });

  test("should write date and time in the time zone it is given", () => {
    expect(formatDateTime(AFTERNOON, { timeZone: "UTC" })).toBe(
      "10.11.2026 11:30"
    );
    expect(formatDateTime(AFTERNOON, { timeZone: "America/New_York" })).toBe(
      "10.11.2026 06:30"
    );
    expect(formatDateTime(AFTERNOON, { timeZone: "Asia/Kolkata" })).toBe(
      "10.11.2026 17:00"
    );
  });

  test("should move the date when the zone is past midnight", () => {
    expect(formatDateTime(new Date("2026-12-31T21:30:00Z"))).toBe(
      "01.01.2027 00:30"
    );
  });

  test("should write midnight as 00:00 and the last minute as 23:59", () => {
    expect(formatDateTime(new Date("2026-01-01T21:00:00Z"))).toBe(
      "02.01.2026 00:00"
    );
    expect(formatDateTime(new Date("2026-01-01T20:59:59.999Z"))).toBe(
      "01.01.2026 23:59"
    );
  });

  test("should pad hours and minutes", () => {
    expect(formatDateTime(new Date("2026-03-04T02:05:00Z"))).toBe(
      "04.03.2026 05:05"
    );
  });

  test("should follow the daylight saving time Turkey kept until 2016", () => {
    // Noon UTC was 15:00 in summer and 14:00 in winter; since 2016 it is 15:00 all year.
    expect(formatDateTime(new Date("2015-06-15T12:00:00Z"))).toBe(
      "15.06.2015 15:00"
    );
    expect(formatDateTime(new Date("2015-01-15T12:00:00Z"))).toBe(
      "15.01.2015 14:00"
    );
    expect(formatDateTime(new Date("2026-01-15T12:00:00Z"))).toBe(
      "15.01.2026 15:00"
    );
  });

  test("should accept a timestamp in milliseconds", () => {
    expect(formatDateTime(AFTERNOON.getTime())).toBe("10.11.2026 14:30");
    expect(formatDateTime(0, { timeZone: "UTC" })).toBe("01.01.1970 00:00");
  });

  test("should give the same text whatever zone the process runs in", () => {
    const original = process.env.TZ;
    try {
      for (const zone of ["Pacific/Kiritimati", "America/Los_Angeles"]) {
        process.env.TZ = zone;
        expect(formatDateTime(AFTERNOON)).toBe("10.11.2026 14:30");
      }
    } finally {
      process.env.TZ = original;
    }
  });

  test("should throw a RangeError for an invalid or unsupported date", () => {
    expect(() => formatDateTime(new Date(Number.NaN))).toThrow(
      new RangeError("formatDateTime: received an invalid date")
    );
    expect(() => formatDateTime(Number.NaN)).toThrow(
      new RangeError("formatDateTime: received an invalid date")
    );
    expect(() => formatDateTime(new Date("9999-12-31T12:00:00Z"))).toThrow(
      new RangeError(
        "formatDateTime: the date is outside the supported years 0001 to 9999"
      )
    );
  });

  test("should throw a TypeError for a date written as text", () => {
    const error = new TypeError(
      "formatDateTime: expected a Date or a timestamp in milliseconds, received string"
    );
    expect(() => formatDateTime("2026-11-10" as unknown as Date)).toThrow(
      error
    );
    expect(() =>
      formatDateTime("2026-11-10T11:30:00Z" as unknown as Date)
    ).toThrow(error);
  });

  test.each(NON_DATES)("should throw a TypeError for %o", (value, received) => {
    expect(() => formatDateTime(value as Date)).toThrow(
      new TypeError(
        `formatDateTime: expected a Date or a timestamp in milliseconds, received ${received}`
      )
    );
  });

  test("should throw for a time zone that is unknown or not a string", () => {
    expect(() =>
      formatDateTime(AFTERNOON, { timeZone: "Mars/Olympus" })
    ).toThrow(
      new RangeError(
        'formatDateTime: unknown time zone "Mars/Olympus", expected an IANA name like "Europe/Istanbul"'
      )
    );
    expect(() =>
      formatDateTime(AFTERNOON, { timeZone: 180 } as unknown as TimeZoneOptions)
    ).toThrow(
      new TypeError(
        "formatDateTime: expected timeZone to be a string, received number"
      )
    );
  });
});
