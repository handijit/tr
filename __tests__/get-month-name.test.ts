import { describe, expect, test } from "vitest";

import getMonthName from "../lib/modules/get-month-name";
import MONTH_NAMES from "../lib/modules/month-names";
import NON_DATES from "./support/non-dates";

describe("getMonthName", () => {
  test("should name the month of a calendar date string", () => {
    expect(getMonthName("2026-11-10")).toBe("Kasım");
    expect(getMonthName("2026-01-01")).toBe("Ocak");
    expect(getMonthName("2026-12-31")).toBe("Aralık");
  });

  test("should name all twelve months", () => {
    const names = MONTH_NAMES.map((_name, index) =>
      getMonthName(`2026-${String(index + 1).padStart(2, "0")}-15`)
    );
    expect(names).toEqual(MONTH_NAMES);
  });

  test("should read an instant in Istanbul by default", () => {
    // 21:30 UTC on 31 October is already 1 November in Istanbul.
    const instant = new Date("2026-10-31T21:30:00Z");
    expect(getMonthName(instant)).toBe("Kasım");
    expect(getMonthName(instant.getTime())).toBe("Kasım");
    expect(getMonthName(instant, {})).toBe("Kasım");
  });

  test("should read an instant in the time zone it is given", () => {
    const instant = new Date("2026-10-31T21:30:00Z");
    expect(getMonthName(instant, { timeZone: "UTC" })).toBe("Ekim");
    expect(getMonthName(instant, { timeZone: "Asia/Tokyo" })).toBe("Kasım");
  });

  test("should throw a RangeError for a date that does not exist", () => {
    expect(() => getMonthName("2026-13-01")).toThrow(
      new RangeError(
        'getMonthName: expected a real calendar date like "2026-11-10", received "2026-13-01"'
      )
    );
    expect(() => getMonthName(new Date(Number.NaN))).toThrow(
      new RangeError("getMonthName: received an invalid date")
    );
  });

  test("should throw a RangeError for an unknown time zone", () => {
    expect(() => getMonthName(0, { timeZone: "Nowhere" })).toThrow(
      new RangeError(
        'getMonthName: unknown time zone "Nowhere", expected an IANA name like "Europe/Istanbul"'
      )
    );
  });

  test.each(NON_DATES)("should throw a TypeError for %o", (value, received) => {
    expect(() => getMonthName(value as Date)).toThrow(
      new TypeError(
        `getMonthName: expected a Date or a timestamp in milliseconds, received ${received}`
      )
    );
  });
});
