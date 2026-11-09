import { runInNewContext } from "node:vm";

import { describe, expect, test } from "vitest";

import formatDate from "../lib/modules/format-date";
import type { TimeZoneOptions } from "../lib/types";
import NON_DATES from "./support/non-dates";

// 21:30 UTC on 10 November 2026 is already 00:30 on the 11th in Istanbul (UTC+3).
const EVENING = new Date("2026-11-10T21:30:00Z");

describe("formatDate", () => {
  test("should write the day an instant falls on in Istanbul by default", () => {
    expect(formatDate(EVENING)).toBe("11.11.2026");
    expect(formatDate(new Date("2026-11-10T09:00:00Z"))).toBe("10.11.2026");
    expect(formatDate(EVENING, {})).toBe("11.11.2026");
    expect(formatDate(EVENING, { timeZone: undefined })).toBe("11.11.2026");
  });

  test("should write the day in the time zone it is given", () => {
    expect(formatDate(EVENING, { timeZone: "UTC" })).toBe("10.11.2026");
    expect(formatDate(EVENING, { timeZone: "America/New_York" })).toBe(
      "10.11.2026"
    );
    expect(formatDate(EVENING, { timeZone: "Asia/Tokyo" })).toBe("11.11.2026");
    expect(formatDate(EVENING, { timeZone: "Europe/Istanbul" })).toBe(
      "11.11.2026"
    );
  });

  test("should give the same text whatever zone the process runs in", () => {
    const original = process.env.TZ;
    try {
      for (const zone of ["Pacific/Kiritimati", "Pacific/Pago_Pago", "UTC"]) {
        process.env.TZ = zone;
        expect(formatDate(EVENING)).toBe("11.11.2026");
      }
    } finally {
      process.env.TZ = original;
    }
  });

  test("should accept a timestamp in milliseconds", () => {
    expect(formatDate(EVENING.getTime())).toBe("11.11.2026");
    expect(formatDate(0)).toBe("01.01.1970");
    expect(formatDate(-0)).toBe("01.01.1970");
    expect(formatDate(0.5)).toBe("01.01.1970");
  });

  test("should pad day, month and year", () => {
    expect(formatDate(new Date("2026-01-05T12:00:00Z"))).toBe("05.01.2026");
    expect(formatDate(new Date("0987-03-04T12:00:00Z"))).toBe("04.03.0987");
  });

  test("should write a calendar date string as it stands", () => {
    expect(formatDate("2026-11-10")).toBe("10.11.2026");
    expect(formatDate("2026-01-05")).toBe("05.01.2026");
    expect(formatDate("2024-02-29")).toBe("29.02.2024");
    expect(formatDate("0001-01-01")).toBe("01.01.0001");
    expect(formatDate("9999-12-31")).toBe("31.12.9999");
  });

  test("should not move a calendar date string into a time zone", () => {
    expect(formatDate("2026-11-10", { timeZone: "Pacific/Kiritimati" })).toBe(
      "10.11.2026"
    );
    expect(formatDate("2026-11-10", { timeZone: "Pacific/Pago_Pago" })).toBe(
      "10.11.2026"
    );
  });

  test("should read a Date made in another realm", () => {
    const foreign = runInNewContext("new Date(Date.UTC(2026, 10, 10, 9))");
    expect(foreign instanceof Date).toBe(false);
    expect(formatDate(foreign)).toBe("10.11.2026");
  });

  test("should use the proleptic Gregorian calendar for old dates", () => {
    expect(
      formatDate(new Date("1500-03-01T12:00:00Z"), { timeZone: "UTC" })
    ).toBe("01.03.1500");
  });

  test("should write the first and the last supported instant", () => {
    expect(
      formatDate(new Date("0001-01-02T00:00:00Z"), { timeZone: "UTC" })
    ).toBe("02.01.0001");
    expect(
      formatDate(new Date("9999-12-30T23:59:59.999Z"), { timeZone: "UTC" })
    ).toBe("30.12.9999");
  });

  test("should throw a RangeError outside the years 0001 to 9999", () => {
    const error = new RangeError(
      "formatDate: the date is outside the supported years 0001 to 9999"
    );
    expect(() => formatDate(new Date("0001-01-01T23:59:59.999Z"))).toThrow(
      error
    );
    expect(() => formatDate(new Date("9999-12-31T00:00:00Z"))).toThrow(error);
    expect(() => formatDate(new Date("-000001-06-15T00:00:00Z"))).toThrow(
      error
    );
    expect(() => formatDate(8.64e15)).toThrow(error);
    expect(() => formatDate(Number.POSITIVE_INFINITY)).toThrow(error);
    expect(() => formatDate(Number.NEGATIVE_INFINITY)).toThrow(error);
  });

  test("should throw a RangeError for an invalid date", () => {
    const error = new RangeError("formatDate: received an invalid date");
    expect(() => formatDate(new Date("not a date"))).toThrow(error);
    expect(() => formatDate(new Date(Number.NaN))).toThrow(error);
    expect(() => formatDate(Number.NaN)).toThrow(error);
  });

  test.each([
    "2026-02-31",
    "2023-02-29",
    "2026-13-01",
    "2026-00-10",
    "2026-11-00",
    "0000-01-01",
    "2026-11-10T09:00:00Z",
    "2026-11-10 09:00",
    "2026-1-5",
    "10.11.2026",
    "11/10/2026",
    "20261110",
    " 2026-11-10",
    "",
    "bugün",
  ])("should throw a RangeError for the text %j", (text) => {
    expect(() => formatDate(text)).toThrow(
      new RangeError(
        `formatDate: expected a real calendar date like "2026-11-10", received "${text}"`
      )
    );
  });

  test("should echo only the start of a very long text", () => {
    expect(() => formatDate("x".repeat(100_000))).toThrow(
      new RangeError(
        `formatDate: expected a real calendar date like "2026-11-10", received "${"x".repeat(32)}"`
      )
    );
  });

  test.each(NON_DATES)("should throw a TypeError for %o", (value, received) => {
    expect(() => formatDate(value as Date)).toThrow(
      new TypeError(
        `formatDate: expected a Date or a timestamp in milliseconds, received ${received}`
      )
    );
  });

  test("should throw a RangeError for an unknown time zone", () => {
    expect(() => formatDate(EVENING, { timeZone: "Europe/Atlantis" })).toThrow(
      new RangeError(
        'formatDate: unknown time zone "Europe/Atlantis", expected an IANA name like "Europe/Istanbul"'
      )
    );
    expect(() => formatDate(EVENING, { timeZone: "" })).toThrow(RangeError);
    expect(() => formatDate(EVENING, { timeZone: "z".repeat(1000) })).toThrow(
      new RangeError(
        `formatDate: unknown time zone "${"z".repeat(32)}", expected an IANA name like "Europe/Istanbul"`
      )
    );
  });

  test("should throw a TypeError for a time zone that is not a string", () => {
    expect(() =>
      formatDate(EVENING, { timeZone: null } as unknown as TimeZoneOptions)
    ).toThrow(
      new TypeError(
        "formatDate: expected timeZone to be a string, received null"
      )
    );
    expect(() =>
      formatDate(EVENING, { timeZone: 3 } as unknown as TimeZoneOptions)
    ).toThrow(
      new TypeError(
        "formatDate: expected timeZone to be a string, received number"
      )
    );
  });

  test("should throw a TypeError for options that are not an object", () => {
    expect(() =>
      formatDate(EVENING, null as unknown as TimeZoneOptions)
    ).toThrow(TypeError);
  });

  test("should not change the Date it is given", () => {
    const date = new Date(EVENING);
    formatDate(date);
    expect(date.getTime()).toBe(EVENING.getTime());
  });
});
