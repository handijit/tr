import { describe, expect, test } from "vitest";

import formatMoney from "../lib/modules/format-money";
import parseMoney from "../lib/modules/parse-money";
import NON_STRINGS from "./support/non-strings";

describe("parseMoney", () => {
  test.each([
    ["3.490,50", 349050],
    ["3.490", 349000],
    ["3490", 349000],
    ["3490,5", 349050],
    ["3490,50", 349050],
    ["0", 0],
    ["0,05", 5],
    ["0,5", 50],
    ["1", 100],
    ["12", 1200],
    ["999,99", 99999],
    ["1.000", 100000],
    ["1.234.567,89", 123456789],
    ["12.345.678,9", 1234567890],
    ["007", 700],
  ])("should read %j as %d kuruş", (text, kurus) => {
    expect(parseMoney(text)).toBe(kurus);
  });

  test.each([
    ["₺3.490,50", 349050],
    ["₺ 3.490,50", 349050],
    ["3.490,50 ₺", 349050],
    ["3.490,50 TL", 349050],
    ["3.490,50TL", 349050],
    ["3.490,50 tl", 349050],
    ["TL 3.490,50", 349050],
    ["3.490,50 TRY", 349050],
    ["try 3.490,50", 349050],
  ])("should read %j with its currency mark", (text, kurus) => {
    expect(parseMoney(text)).toBe(kurus);
  });

  test.each([
    ["-3.490,50", -349050],
    ["- 3.490,50", -349050],
    ["−3.490,50", -349050],
    ["-₺3.490,50", -349050],
    ["₺-3.490,50", -349050],
    ["-3.490,50 TL", -349050],
    ["+3.490,50", 349050],
    ["+₺5", 500],
  ])("should read the sign of %j", (text, kurus) => {
    expect(parseMoney(text)).toBe(kurus);
  });

  test("should read spaces as layout, not as part of the amount", () => {
    expect(parseMoney("  3.490,50  ")).toBe(349050);
    expect(parseMoney("3.490,50 TL")).toBe(349050);
    expect(parseMoney("1 250,50")).toBe(125050);
  });

  test("should never return negative zero", () => {
    expect(Object.is(parseMoney("-0"), 0)).toBe(true);
    expect(Object.is(parseMoney("-0,00"), 0)).toBe(true);
    expect(Object.is(parseMoney("−₺0"), 0)).toBe(true);
  });

  test.each([
    ["a dot used as the decimal separator", "1250.50"],
    ["a dot before a group that is not three digits", "1.23"],
    ["a dot before a group that is too long", "1.2345"],
    ["a plain number followed by a thousands group", "1234.567"],
    ["a grouped amount that starts with zero", "0.500"],
    ["a group of four digits before the first dot", "1234.567.890"],
    ["three kuruş digits", "1,505"],
    ["a comma without kuruş", "12,"],
    ["kuruş without lira", ",50"],
    ["two commas", "1,2,3"],
    ["a comma used as the thousands separator", "1,250.50"],
    ["two signs", "--5"],
    ["a sign on both sides of the currency mark", "-₺-5"],
    ["a trailing sign", "5-"],
    ["two currency marks", "₺5 TL"],
    ["another currency", "5 USD"],
    ["a dollar sign", "$5"],
    ["exponent notation", "1e3"],
    ["a hexadecimal number", "0x10"],
    ["Arabic-Indic digits", "٣٤٩٠"],
    ["full-width digits", "３４９０"],
    ["words", "üç bin"],
    ["only a currency mark", "TL"],
    ["only a sign", "-"],
    ["nothing", ""],
    ["only spaces", "   "],
    ["Infinity", "Infinity"],
    ["NaN", "NaN"],
  ])("should return null for %s", (_reason, text) => {
    expect(parseMoney(text)).toBeNull();
  });

  test("should read the largest safe amount and refuse the next kuruş", () => {
    expect(parseMoney("90.071.992.547.409,91")).toBe(Number.MAX_SAFE_INTEGER);
    expect(parseMoney("-90.071.992.547.409,91")).toBe(Number.MIN_SAFE_INTEGER);
    expect(parseMoney("90.071.992.547.409,92")).toBeNull();
    expect(parseMoney("90071992547409,93")).toBeNull();
    expect(parseMoney("9".repeat(400))).toBeNull();
  });

  test("should not lose a kuruş to float arithmetic", () => {
    // 0.1 + 0.2 and 1.15 * 100 are the classic float traps; text digits avoid both.
    expect(parseMoney("0,30")).toBe(30);
    expect(parseMoney("1,15")).toBe(115);
    expect(parseMoney("19,99")).toBe(1999);
    expect(parseMoney("4.035,35")).toBe(403535);
  });

  test("should read back everything formatMoney writes", () => {
    let seed = 349050;
    for (let i = 0; i < 20_000; i += 1) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const magnitude = 10 ** (1 + (i % 16));
      const kurus = Math.min(
        Math.floor((seed / 2147483648) * magnitude),
        Number.MAX_SAFE_INTEGER
      );
      expect(parseMoney(formatMoney(kurus))).toBe(kurus);
      expect(parseMoney(formatMoney(kurus, { symbol: true }))).toBe(kurus);
      expect(parseMoney(formatMoney(-kurus))).toBe(0 - kurus);
    }
  });

  test("should answer quickly for a very long input", () => {
    expect(parseMoney(`1${".234".repeat(250_000)}x`)).toBeNull();
    expect(parseMoney(`${"9".repeat(1_000_000)},`)).toBeNull();
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => parseMoney(value as string)).toThrow(
        new TypeError(`parseMoney: expected a string, received ${received}`)
      );
    }
  );
});
