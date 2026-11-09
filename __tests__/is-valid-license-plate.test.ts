import { describe, expect, test } from "vitest";

import isValidLicensePlate from "../lib/modules/is-valid-license-plate";
import NON_STRING_VALUES from "./support/non-string-values";

describe("isValidLicensePlate", () => {
  test.each([
    "34 A 1234",
    "34 A 12345",
    "34 AB 123",
    "34 AB 1234",
    "34 ABC 12",
    "34 ABC 123",
  ])("should accept the civil layout %s", (plate) => {
    expect(isValidLicensePlate(plate)).toBe(true);
  });

  test("should accept a plate written without spaces or with extra ones", () => {
    expect(isValidLicensePlate("34ABC123")).toBe(true);
    expect(isValidLicensePlate("06A1234")).toBe(true);
    expect(isValidLicensePlate("  34 ABC 123  ")).toBe(true);
    expect(isValidLicensePlate("34  ABC\t123")).toBe(true);
    expect(isValidLicensePlate("34ABC 123")).toBe(true);
  });

  test("should accept lower-case letters", () => {
    expect(isValidLicensePlate("34 abc 123")).toBe(true);
    expect(isValidLicensePlate("06 Ab 1234")).toBe(true);
  });

  test("should accept every province code from 01 to 81", () => {
    for (let code = 1; code <= 81; code += 1) {
      const plate = `${String(code).padStart(2, "0")} AB 123`;
      expect(isValidLicensePlate(plate), plate).toBe(true);
    }
  });

  test("should reject a province code outside 01 to 81", () => {
    for (const code of ["00", "82", "83", "90", "99"]) {
      expect(isValidLicensePlate(`${code} AB 123`), code).toBe(false);
    }
    expect(isValidLicensePlate("6 AB 123")).toBe(false);
    expect(isValidLicensePlate("006 AB 123")).toBe(false);
    expect(isValidLicensePlate("AB 123")).toBe(false);
  });

  test("should accept each of the 23 plate letters", () => {
    for (const letter of "ABCDEFGHIJKLMNOPRSTUVYZ") {
      expect(isValidLicensePlate(`34 ${letter}${letter} 123`), letter).toBe(
        true
      );
    }
  });

  test("should reject the letters plates do not use", () => {
    for (const letter of "QWXÇĞİÖŞÜqwxçğıöşü") {
      expect(isValidLicensePlate(`34 A${letter} 123`), letter).toBe(false);
      expect(isValidLicensePlate(`34 ${letter} 1234`), letter).toBe(false);
    }
  });

  test.each([
    ["one letter with three digits", "34 A 123"],
    ["one letter with six digits", "34 A 123456"],
    ["two letters with two digits", "34 AB 12"],
    ["two letters with five digits", "34 AB 12345"],
    ["three letters with one digit", "34 ABC 1"],
    ["three letters with four digits", "34 ABC 1234"],
    ["four letters", "34 ABCD 12"],
    ["no letters", "34 12345"],
    ["no digits", "34 ABC"],
    ["letters first", "ABC 34 123"],
    ["digits between the letters", "34 A1B 123"],
    ["a letter after the digits", "34 AB 123 C"],
    ["hyphens as separators", "34-ABC-123"],
    ["dots as separators", "34.ABC.123"],
    ["the country prefix", "TR 34 ABC 123"],
    ["full-width digits", "３４ ABC 123"],
    ["nothing", ""],
    ["only spaces", "   "],
  ])("should reject %s", (_reason, plate) => {
    expect(isValidLicensePlate(plate)).toBe(false);
  });

  test.each(NON_STRING_VALUES)("should reject the non-string %o", (value) => {
    expect(isValidLicensePlate(value)).toBe(false);
  });

  test("should reject a plate wrapped in an object", () => {
    expect(isValidLicensePlate(new String("34 ABC 123"))).toBe(false);
    expect(isValidLicensePlate(["34 ABC 123"])).toBe(false);
    expect(isValidLicensePlate({ toString: () => "34 ABC 123" })).toBe(false);
  });

  test("should answer quickly for a very long input", () => {
    expect(isValidLicensePlate(`34${" ".repeat(1_000_000)}A`)).toBe(false);
    expect(isValidLicensePlate(`34 A ${"1".repeat(1_000_000)}`)).toBe(false);
  });
});
