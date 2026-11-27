import { describe, expect, test } from "vitest";

import formatLira from "../lib/modules/format-lira";

describe("formatLira", () => {
  test.each([
    [123456, "₺1.234,56"],
    [5, "₺0,05"],
    [0, "₺0,00"],
    [-0, "₺0,00"],
    [-5, "-₺0,05"],
    [100, "₺1,00"],
    [99999, "₺999,99"],
    [100000, "₺1.000,00"],
    [12345600, "₺123.456,00"],
    [123456789, "₺1.234.567,89"],
    [Number.MAX_SAFE_INTEGER, "₺90.071.992.547.409,91"],
  ])("should format %j kuruş as %j", (kurus, expected) => {
    expect(formatLira(kurus)).toBe(expected);
  });

  test("should accept a bigint beyond Number.MAX_SAFE_INTEGER", () => {
    expect(formatLira(123456789012345678901n)).toBe(
      "₺1.234.567.890.123.456.789,01"
    );
    expect(formatLira(-1n)).toBe("-₺0,01");
  });

  test("should drop the symbol only for symbol: false", () => {
    expect(formatLira(123456, { symbol: false })).toBe("1.234,56");
    expect(formatLira(123456, { symbol: true })).toBe("₺1.234,56");
    expect(formatLira(123456, { symbol: "no" as unknown as boolean })).toBe(
      "₺1.234,56"
    );
  });

  test.each([
    [123456, "₺1.235"],
    [123449, "₺1.234"],
    [150, "₺2"],
    [-150, "-₺2"],
    [-49, "₺0"],
    [-50, "-₺1"],
    [0, "₺0"],
  ])(
    "should round %j kuruş half away from zero without fraction",
    (kurus, expected) => {
      expect(formatLira(kurus, { fraction: false })).toBe(expected);
    }
  );

  test("should combine both options", () => {
    expect(formatLira(123456, { symbol: false, fraction: false })).toBe(
      "1.235"
    );
  });

  test.each([1.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "should throw a RangeError for %j",
    (kurus) => {
      expect(() => formatLira(kurus)).toThrow(RangeError);
    }
  );

  test("should throw a TypeError for a non-numeric amount", () => {
    expect(() => formatLira("100" as unknown as number)).toThrow(
      new TypeError(
        "formatLira: expected an integer amount of kuruş (number or bigint), received string"
      )
    );
    expect(() => formatLira(null as unknown as number)).toThrow(TypeError);
  });
});
