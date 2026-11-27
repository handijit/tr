import { describe, expect, test } from "vitest";

import addVat from "../lib/modules/add-vat";

describe("addVat", () => {
  test.each([
    [10000, 20, 12000],
    [999, 20, 1199],
    [5, 10, 6],
    [4, 10, 4],
    [-5, 10, -6],
    [100, 0, 100],
    [100, 0.5, 101],
    [10000, 0.07, 10007],
    [0, 20, 0],
    [-0, 20, 0],
  ])("should add VAT to %j kuruş at %j%% → %j", (kurus, rate, expected) => {
    expect(addVat(kurus, rate)).toBe(expected);
  });

  test("should keep a bigint amount a bigint", () => {
    expect(addVat(10000n, 20)).toBe(12000n);
    expect(addVat(BigInt(Number.MAX_SAFE_INTEGER), 20)).toBe(
      10808639105689189n
    );
  });

  test("should throw instead of returning an unsafe number", () => {
    expect(() => addVat(Number.MAX_SAFE_INTEGER, 20)).toThrow(
      /exceeds Number.MAX_SAFE_INTEGER; pass the amount as a bigint/
    );
  });

  test.each([NaN, -1, Infinity, 0.001, 1e300])(
    "should throw a RangeError for rate %j",
    (rate) => {
      expect(() => addVat(100, rate)).toThrow(RangeError);
    }
  );

  test("should throw a TypeError for a non-numeric rate", () => {
    expect(() => addVat(100, "20" as unknown as number)).toThrow(
      new TypeError(
        "addVat: expected ratePercent to be a number, received string"
      )
    );
  });

  test("should reject an amount that is not integer kuruş", () => {
    expect(() => addVat(1.5, 20)).toThrow(RangeError);
    expect(() => addVat("1" as unknown as number, 20)).toThrow(TypeError);
  });
});
