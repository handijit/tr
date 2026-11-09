import { describe, expect, test } from "vitest";

import formatMoney from "../lib/modules/format-money";
import type { FormatMoneyOptions } from "../lib/modules/format-money";
import { NON_NUMBERS, UNSAFE_AMOUNTS } from "./support/non-numbers";

// Exact reference in BigInt: no float is involved, so it shows what the amount really is.
const referenceFormat = (kurus: number): string => {
  const amount = BigInt(kurus);
  const absolute = amount < 0n ? -amount : amount;
  const lira = (absolute / 100n).toString();
  const groups: string[] = [];
  for (let end = lira.length; end > 0; end -= 3) {
    groups.unshift(lira.slice(Math.max(0, end - 3), end));
  }
  const kurusPart = (absolute % 100n).toString().padStart(2, "0");
  return `${amount < 0n ? "-" : ""}${groups.join(".")},${kurusPart} TL`;
};

describe("formatMoney", () => {
  test.each([
    [0, "0,00 TL"],
    [5, "0,05 TL"],
    [50, "0,50 TL"],
    [99, "0,99 TL"],
    [100, "1,00 TL"],
    [1999, "19,99 TL"],
    [99999, "999,99 TL"],
    [100000, "1.000,00 TL"],
    [349000, "3.490,00 TL"],
    [349050, "3.490,50 TL"],
    [12345678, "123.456,78 TL"],
    [123456789, "1.234.567,89 TL"],
    [100000000000, "1.000.000.000,00 TL"],
  ])("should write %d kuruş as %s", (kurus, text) => {
    expect(formatMoney(kurus)).toBe(text);
  });

  test("should put the lira sign in front when symbol is true", () => {
    expect(formatMoney(349000, { symbol: true })).toBe("₺3.490,00");
    expect(formatMoney(5, { symbol: true })).toBe("₺0,05");
  });

  test("should write TL after the amount by default", () => {
    expect(formatMoney(349000, {})).toBe("3.490,00 TL");
    expect(formatMoney(349000, { symbol: false })).toBe("3.490,00 TL");
    expect(formatMoney(349000, { symbol: undefined })).toBe("3.490,00 TL");
    expect(formatMoney(349000, undefined)).toBe("3.490,00 TL");
  });

  test("should not turn the symbol on for a value that is not true", () => {
    expect(
      formatMoney(349000, { symbol: "yes" } as unknown as FormatMoneyOptions)
    ).toBe("3.490,00 TL");
    expect(
      formatMoney(349000, { symbol: 1 } as unknown as FormatMoneyOptions)
    ).toBe("3.490,00 TL");
  });

  test("should write a negative amount with a leading hyphen", () => {
    expect(formatMoney(-5)).toBe("-0,05 TL");
    expect(formatMoney(-349050)).toBe("-3.490,50 TL");
    expect(formatMoney(-349050, { symbol: true })).toBe("-₺3.490,50");
  });

  test("should write negative zero without a sign", () => {
    expect(formatMoney(-0)).toBe("0,00 TL");
    expect(formatMoney(-0, { symbol: true })).toBe("₺0,00");
  });

  test("should write the largest and the smallest safe amount exactly", () => {
    expect(formatMoney(Number.MAX_SAFE_INTEGER)).toBe(
      "90.071.992.547.409,91 TL"
    );
    expect(formatMoney(Number.MIN_SAFE_INTEGER)).toBe(
      "-90.071.992.547.409,91 TL"
    );
  });

  test("should match exact integer arithmetic across the whole safe range", () => {
    // A fixed linear congruential sequence: the same amounts on every run.
    let seed = 20261110;
    for (let i = 0; i < 20_000; i += 1) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const magnitude = 10 ** (1 + (i % 16));
      const kurus = Math.min(
        Math.floor((seed / 2147483648) * magnitude),
        Number.MAX_SAFE_INTEGER
      );
      expect(formatMoney(kurus)).toBe(referenceFormat(kurus));
      expect(formatMoney(-kurus)).toBe(referenceFormat(-kurus));
    }
  });

  test("should print an amount that was rounded to kuruş before the call", () => {
    // 19.99 * 100 is 1998.9999999999998 as a float; the caller rounds, the text is exact.
    expect(formatMoney(Math.round(19.99 * 100))).toBe("19,99 TL");
  });

  test.each(NON_NUMBERS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => formatMoney(value as number)).toThrow(
        new TypeError(
          `formatMoney: expected an amount in kuruş as a number, received ${received}`
        )
      );
    }
  );

  test.each(UNSAFE_AMOUNTS)("should throw a RangeError for %d", (value) => {
    expect(() => formatMoney(value)).toThrow(
      new RangeError(
        `formatMoney: expected a whole number of kuruş within the safe integer range, received ${value}`
      )
    );
  });
});
