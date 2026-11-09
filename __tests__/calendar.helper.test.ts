import { describe, expect, test } from "vitest";

import isRealDate from "../lib/helpers/calendar.helper";

describe("isRealDate", () => {
  test("should accept the first and the last day of every month", () => {
    const lastDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    lastDays.forEach((lastDay, index) => {
      expect(isRealDate(2026, index + 1, 1)).toBe(true);
      expect(isRealDate(2026, index + 1, lastDay)).toBe(true);
      expect(isRealDate(2026, index + 1, lastDay + 1)).toBe(false);
    });
  });

  test("should apply the Gregorian leap year rule", () => {
    expect(isRealDate(2024, 2, 29)).toBe(true);
    expect(isRealDate(2023, 2, 29)).toBe(false);
    expect(isRealDate(1900, 2, 29)).toBe(false);
    expect(isRealDate(2000, 2, 29)).toBe(true);
    expect(isRealDate(2024, 2, 30)).toBe(false);
  });

  test("should reject a day or a month below 1", () => {
    expect(isRealDate(2026, 1, 0)).toBe(false);
    expect(isRealDate(2026, 0, 1)).toBe(false);
    expect(isRealDate(2026, -1, 1)).toBe(false);
  });

  test("should reject a month above 12", () => {
    expect(isRealDate(2026, 13, 1)).toBe(false);
  });

  test("should accept the years 1 to 9999 only", () => {
    expect(isRealDate(1, 1, 1)).toBe(true);
    expect(isRealDate(9999, 12, 31)).toBe(true);
    expect(isRealDate(0, 1, 1)).toBe(false);
    expect(isRealDate(10000, 1, 1)).toBe(false);
  });
});
