import { describe, expect, test } from "vitest";

import removeVat from "../lib/modules/remove-vat";

describe("removeVat", () => {
  test.each([
    [12000, 20, 10000],
    [1199, 20, 999],
    [6, 10, 5],
    [-6, 10, -5],
    [3, 100, 2],
    [-3, 100, -2],
    [100, 0, 100],
    [0, 20, 0],
  ])("should strip VAT from %j kuruş at %j%% → %j", (gross, rate, expected) => {
    expect(removeVat(gross, rate)).toBe(expected);
  });

  test("should keep a bigint amount a bigint", () => {
    expect(removeVat(12000n, 20)).toBe(10000n);
  });

  test("should validate its arguments", () => {
    expect(() => removeVat(100, -20)).toThrow(RangeError);
    expect(() => removeVat(NaN, 20)).toThrow(RangeError);
    expect(() => removeVat(undefined as unknown as number, 20)).toThrow(
      new TypeError(
        "removeVat: expected an integer amount of kuruş (number or bigint), received undefined"
      )
    );
  });
});
