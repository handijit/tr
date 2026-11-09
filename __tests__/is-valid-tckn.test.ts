import { describe, expect, test } from "vitest";

import isValidTckn from "../lib/modules/is-valid-tckn";
import { makeTckn, VALID_TCKNS } from "./support/identity-numbers";
import NON_STRING_VALUES from "./support/non-string-values";

describe("isValidTckn", () => {
  test.each(VALID_TCKNS)("should accept the generated number %s", (tckn) => {
    expect(isValidTckn(tckn)).toBe(true);
  });

  test("should accept the sample number every validator documents", () => {
    expect(makeTckn("100000001")).toBe("10000000146");
    expect(isValidTckn("10000000146")).toBe(true);
  });

  test("should accept a number whose tenth digit comes from a negative difference", () => {
    // Odd places add up to 1 and even places to 36, so "odd * 7 - even" is -29.
    expect(makeTckn("190909090")).toBe("19090909018");
    expect(isValidTckn("19090909018")).toBe(true);
  });

  test("should ignore spaces around and inside the number", () => {
    expect(isValidTckn(" 100 000 001 46 ")).toBe(true);
    expect(isValidTckn("10000000146\n")).toBe(true);
  });

  test("should reject every single-digit change of a valid number", () => {
    for (const tckn of VALID_TCKNS) {
      for (let index = 0; index < tckn.length; index += 1) {
        for (let digit = 0; digit <= 9; digit += 1) {
          if (String(digit) === tckn[index]) continue;
          const changed = `${tckn.slice(0, index)}${digit}${tckn.slice(index + 1)}`;
          expect(isValidTckn(changed), changed).toBe(false);
        }
      }
    }
  });

  test("should reject a number that starts with 0", () => {
    // The check digits of this one are right; only the first digit rule fails it.
    expect(makeTckn("012345678")).toBe("01234567840");
    expect(isValidTckn("01234567840")).toBe(false);
    expect(isValidTckn("00000000000")).toBe(false);
  });

  test("should reject a wrong length", () => {
    expect(isValidTckn("1000000014")).toBe(false);
    expect(isValidTckn("100000001460")).toBe(false);
    expect(isValidTckn("")).toBe(false);
    expect(isValidTckn("   ")).toBe(false);
  });

  test("should reject anything that is not an ASCII digit", () => {
    expect(isValidTckn("1000000014a")).toBe(false);
    expect(isValidTckn("10000000-146")).toBe(false);
    expect(isValidTckn("1000000014６")).toBe(false);
    expect(isValidTckn("１００００００１４６")).toBe(false);
    expect(isValidTckn("1.0000000146e10")).toBe(false);
  });

  test.each(NON_STRING_VALUES)("should reject the non-string %o", (value) => {
    expect(isValidTckn(value)).toBe(false);
  });

  test("should reject a number passed as a number or wrapped in an object", () => {
    expect(isValidTckn(10000000146)).toBe(false);
    expect(isValidTckn(new String("10000000146"))).toBe(false);
    expect(isValidTckn(["10000000146"])).toBe(false);
    expect(isValidTckn({ toString: () => "10000000146" })).toBe(false);
  });
});
