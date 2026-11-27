import { describe, expect, test } from "vitest";

import parseLira from "../lib/modules/parse-lira";

describe("parseLira", () => {
  test.each([
    ["1.234,56", 123456],
    ["1234,5", 123450],
    ["₺1.234", 123400],
    ["₺ 1.234,56", 123456],
    ["₺ 1.234,56", 123456],
    ["1.234,56 TL", 123456],
    ["1.234,56₺", 123456],
    ["1234 try", 123400],
    ["1.234.567,89", 123456789],
    ["0,05", 5],
    ["0", 0],
    ["-0", 0],
    ["0001", 100],
    ["  42  ", 4200],
    ["-12,50", -1250],
    ["-₺12,50", -1250],
    ["90.071.992.547.409,91", Number.MAX_SAFE_INTEGER],
  ])("should read %j as %j kuruş", (text, expected) => {
    expect(parseLira(text)).toBe(expected);
  });

  test.each([
    "",
    "   ",
    "abc",
    "₺",
    "1.23",
    "12.5",
    "1,234.56",
    "12,345",
    "1.234.56",
    ",5",
    "1,",
    "--1",
    "1e3",
    "1 234",
    "NaN",
    "Infinity",
    "₺-1",
  ])("should reject %j", (text) => {
    expect(parseLira(text)).toBeUndefined();
  });

  test("should reject an amount a number cannot hold exactly", () => {
    expect(parseLira("90.071.992.547.409,92")).toBeUndefined();
    expect(parseLira("9".repeat(400))).toBeUndefined();
  });

  test.each([1234, null, undefined, {}, 12n])(
    "should return undefined for non-string %s",
    (value) => {
      expect(parseLira(value)).toBeUndefined();
    }
  );
});
