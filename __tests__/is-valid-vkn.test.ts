import { describe, expect, test } from "vitest";

import isValidVkn from "../lib/modules/is-valid-vkn";
import { makeVkn, VALID_VKNS } from "./support/identity-numbers";
import NON_STRING_VALUES from "./support/non-string-values";

describe("isValidVkn", () => {
  test.each(VALID_VKNS)("should accept the generated number %s", (vkn) => {
    expect(isValidVkn(vkn)).toBe(true);
  });

  test("should accept the sample number every validator documents", () => {
    expect(makeVkn("123456789")).toBe("1234567890");
    expect(isValidVkn("1234567890")).toBe(true);
  });

  test("should accept a number with leading zeros", () => {
    expect(isValidVkn(makeVkn("000000001"))).toBe(true);
  });

  test("should ignore spaces around and inside the number", () => {
    expect(isValidVkn(" 123 456 78 90 ")).toBe(true);
    expect(isValidVkn("1234567890\n")).toBe(true);
  });

  test("should reject every other check digit of a valid number", () => {
    for (const vkn of VALID_VKNS) {
      for (let digit = 0; digit <= 9; digit += 1) {
        if (String(digit) === vkn[9]) continue;
        const changed = `${vkn.slice(0, 9)}${digit}`;
        expect(isValidVkn(changed), changed).toBe(false);
      }
    }
  });

  test("should reject ten zeros", () => {
    expect(isValidVkn("0000000000")).toBe(false);
  });

  test("should reject a wrong length", () => {
    expect(isValidVkn("123456789")).toBe(false);
    expect(isValidVkn("12345678900")).toBe(false);
    expect(isValidVkn("")).toBe(false);
    expect(isValidVkn("   ")).toBe(false);
  });

  test("should reject anything that is not an ASCII digit", () => {
    expect(isValidVkn("123456789O")).toBe(false);
    expect(isValidVkn("123-456-78-90")).toBe(false);
    expect(isValidVkn("１２３４５６７８９０")).toBe(false);
  });

  test.each(NON_STRING_VALUES)("should reject the non-string %o", (value) => {
    expect(isValidVkn(value)).toBe(false);
  });

  test("should reject a number passed as a number or wrapped in an object", () => {
    expect(isValidVkn(1234567890)).toBe(false);
    expect(isValidVkn(new String("1234567890"))).toBe(false);
    expect(isValidVkn({ toString: () => "1234567890" })).toBe(false);
  });
});
