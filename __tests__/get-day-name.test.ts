import { describe, expect, test } from "vitest";

import DAY_NAMES from "../lib/modules/day-names";
import getDayName from "../lib/modules/get-day-name";
import NON_DATES from "./support/non-dates";

describe("getDayName", () => {
  test("should name the day of a calendar date string", () => {
    expect(getDayName("2026-11-10")).toBe("Salı");
    expect(getDayName("2023-10-29")).toBe("Pazar");
    expect(getDayName("1923-10-29")).toBe("Pazartesi");
  });

  test("should name all seven days of a week", () => {
    const names = [9, 10, 11, 12, 13, 14, 15].map((day) =>
      getDayName(`2026-11-${String(day).padStart(2, "0")}`)
    );
    expect(names).toEqual(DAY_NAMES);
  });

  test("should read an instant in Istanbul by default", () => {
    // 21:30 UTC on Tuesday is already Wednesday in Istanbul.
    const instant = new Date("2026-11-10T21:30:00Z");
    expect(getDayName(instant)).toBe("Çarşamba");
    expect(getDayName(instant.getTime())).toBe("Çarşamba");
    expect(getDayName(instant, {})).toBe("Çarşamba");
  });

  test("should read an instant in the time zone it is given", () => {
    const instant = new Date("2026-11-10T21:30:00Z");
    expect(getDayName(instant, { timeZone: "UTC" })).toBe("Salı");
    expect(getDayName(instant, { timeZone: "America/New_York" })).toBe("Salı");
  });

  test("should name days in the first century without shifting the year", () => {
    // Date.UTC would read year 1 as 1901; 1 January 0001 is a Monday.
    expect(getDayName("0001-01-01")).toBe("Pazartesi");
    expect(getDayName("0099-12-31")).toBe("Perşembe");
  });

  test("should agree with the platform for every day of four centuries of month starts", () => {
    const platformNames = [
      "Pazar",
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
    ];
    for (let year = 1700; year <= 2100; year += 1) {
      for (let month = 1; month <= 12; month += 1) {
        const isoDate = `${year}-${String(month).padStart(2, "0")}-01`;
        const expected =
          platformNames[new Date(`${isoDate}T00:00:00Z`).getUTCDay()];
        expect(getDayName(isoDate), isoDate).toBe(expected);
      }
    }
  });

  test("should throw a RangeError for a date that does not exist", () => {
    expect(() => getDayName("2026-02-30")).toThrow(
      new RangeError(
        'getDayName: expected a real calendar date like "2026-11-10", received "2026-02-30"'
      )
    );
    expect(() => getDayName(Number.NaN)).toThrow(
      new RangeError("getDayName: received an invalid date")
    );
  });

  test("should throw a RangeError for an unknown time zone", () => {
    expect(() => getDayName(0, { timeZone: "Nowhere" })).toThrow(
      new RangeError(
        'getDayName: unknown time zone "Nowhere", expected an IANA name like "Europe/Istanbul"'
      )
    );
  });

  test.each(NON_DATES)("should throw a TypeError for %o", (value, received) => {
    expect(() => getDayName(value as Date)).toThrow(
      new TypeError(
        `getDayName: expected a Date or a timestamp in milliseconds, received ${received}`
      )
    );
  });
});
