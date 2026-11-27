import { describe, expect, test } from "vitest";

import formatDateTr from "../lib/modules/format-date-tr";

describe("formatDateTr", () => {
  test.each([
    [new Date("2026-11-27T00:00:00+03:00"), "27.11.2026"],
    [new Date("2026-11-26T21:00:00Z"), "27.11.2026"],
    [new Date("2026-11-26T20:59:59.999Z"), "26.11.2026"],
    [Date.UTC(2026, 0, 5), "05.01.2026"],
    [0, "01.01.1970"],
    [Date.UTC(1969, 11, 31), "31.12.1969"],
  ])("should format %j as %j", (date, expected) => {
    expect(formatDateTr(date)).toBe(expected);
  });

  test("should pad years below 1000 to four digits", () => {
    const date = new Date(0);
    date.setUTCFullYear(5, 0, 1);
    expect(formatDateTr(date)).toBe("01.01.0005");
  });

  test.each([
    new Date(NaN),
    NaN,
    Infinity,
    8.64e15,
    Date.UTC(10000, 0, 1),
    Date.UTC(-1, 0, 1),
  ])("should throw a RangeError for %j", (date) => {
    expect(() => formatDateTr(date)).toThrow(RangeError);
  });

  test.each(["2026-11-27", null, {}])(
    "should throw a TypeError for %j",
    (date) => {
      expect(() => formatDateTr(date as unknown as Date)).toThrow(TypeError);
    }
  );
});
