import { describe, expect, test } from "vitest";

import removeVat from "../lib/modules/remove-vat";
import vatOf from "../lib/modules/vat-of";

describe("vatOf", () => {
  test("should compute the VAT on top of a net amount by default", () => {
    expect(vatOf(10000, 20)).toBe(2000);
    expect(vatOf(5, 10)).toBe(1);
    expect(vatOf(-5, 10)).toBe(-1);
    expect(vatOf(100, 20, { from: "net" })).toBe(20);
    expect(vatOf(100, 20, {})).toBe(20);
  });

  test("should compute the VAT inside a gross amount", () => {
    expect(vatOf(12000, 20, { from: "gross" })).toBe(2000);
    expect(vatOf(1199, 20, { from: "gross" })).toBe(200);
  });

  test("should split every gross amount into net + VAT exactly", () => {
    for (let gross = -500; gross <= 2000; gross++) {
      for (const rate of [1, 10, 20]) {
        expect(
          removeVat(gross, rate) + vatOf(gross, rate, { from: "gross" })
        ).toBe(gross);
      }
    }
  });

  test("should treat an unknown from value as net", () => {
    expect(vatOf(100, 20, { from: "tax" as unknown as "net" })).toBe(20);
  });

  test("should keep a bigint amount a bigint", () => {
    expect(vatOf(10000n, 20)).toBe(2000n);
    expect(vatOf(12000n, 20, { from: "gross" })).toBe(2000n);
  });

  test("should validate its arguments", () => {
    expect(() => vatOf(100, NaN)).toThrow(RangeError);
    expect(() => vatOf(0.5, 20)).toThrow(RangeError);
  });
});
