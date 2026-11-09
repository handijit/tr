import { describe, expect, test } from "vitest";

import formatDate from "../lib/modules/format-date";
import parseDate from "../lib/modules/parse-date";
import NON_STRINGS from "./support/non-strings";

describe("parseDate", () => {
  test("should read dd.MM.yyyy into an ISO calendar date", () => {
    expect(parseDate("10.11.2026")).toBe("2026-11-10");
    expect(parseDate("01.01.2026")).toBe("2026-01-01");
    expect(parseDate("31.12.2026")).toBe("2026-12-31");
  });

  test("should read a day or a month written with one digit", () => {
    expect(parseDate("1.2.2026")).toBe("2026-02-01");
    expect(parseDate("5.11.2026")).toBe("2026-11-05");
    expect(parseDate("05.1.2026")).toBe("2026-01-05");
  });

  test("should ignore spaces around the date", () => {
    expect(parseDate("  10.11.2026\n")).toBe("2026-11-10");
  });

  test("should accept 29 February only in a leap year", () => {
    expect(parseDate("29.02.2024")).toBe("2024-02-29");
    expect(parseDate("29.02.2000")).toBe("2000-02-29");
    expect(parseDate("29.02.2023")).toBeNull();
    expect(parseDate("29.02.1900")).toBeNull();
    expect(parseDate("29.02.2100")).toBeNull();
  });

  test("should return null for a day the month does not have", () => {
    expect(parseDate("31.02.2026")).toBeNull();
    expect(parseDate("30.02.2024")).toBeNull();
    expect(parseDate("31.04.2026")).toBeNull();
    expect(parseDate("31.06.2026")).toBeNull();
    expect(parseDate("31.09.2026")).toBeNull();
    expect(parseDate("31.11.2026")).toBeNull();
    expect(parseDate("32.01.2026")).toBeNull();
    expect(parseDate("00.01.2026")).toBeNull();
  });

  test("should accept the last day of every month", () => {
    const lastDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    lastDays.forEach((day, index) => {
      const month = String(index + 1).padStart(2, "0");
      expect(parseDate(`${day}.${month}.2026`)).toBe(`2026-${month}-${day}`);
      expect(parseDate(`${day + 1}.${month}.2026`)).toBeNull();
    });
  });

  test("should return null for a month outside 1 to 12", () => {
    expect(parseDate("10.00.2026")).toBeNull();
    expect(parseDate("10.13.2026")).toBeNull();
  });

  test("should accept the years 0001 to 9999 only", () => {
    expect(parseDate("01.01.0001")).toBe("0001-01-01");
    expect(parseDate("31.12.9999")).toBe("9999-12-31");
    expect(parseDate("01.01.0000")).toBeNull();
  });

  test.each([
    ["a two-digit year", "10.11.26"],
    ["a five-digit year", "10.11.20266"],
    ["a three-digit day", "010.11.2026"],
    ["slashes", "10/11/2026"],
    ["hyphens", "10-11-2026"],
    ["an ISO date", "2026-11-10"],
    ["a date with a time", "10.11.2026 14:30"],
    ["spaces inside the date", "10. 11. 2026"],
    ["a missing year", "10.11."],
    ["a missing day", ".11.2026"],
    ["a month name", "10 Kasım 2026"],
    ["a negative day", "-1.11.2026"],
    ["a fractional day", "1,5.11.2026"],
    ["full-width digits", "１０.11.2026"],
    ["nothing", ""],
    ["only spaces", "   "],
  ])("should return null for %s", (_reason, text) => {
    expect(parseDate(text)).toBeNull();
  });

  test("should read back everything formatDate writes", () => {
    for (const isoDate of [
      "2026-11-10",
      "2024-02-29",
      "0001-01-01",
      "9999-12-31",
    ]) {
      expect(parseDate(formatDate(isoDate))).toBe(isoDate);
    }
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => parseDate(value as string)).toThrow(
        new TypeError(`parseDate: expected a string, received ${received}`)
      );
    }
  );
});
