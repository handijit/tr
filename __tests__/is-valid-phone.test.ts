import { describe, expect, test } from "vitest";

import isValidPhone from "../lib/modules/is-valid-phone";
import NON_STRING_VALUES from "./support/non-string-values";

describe("isValidPhone", () => {
  test.each([
    "05321234567",
    "5321234567",
    "0532 123 45 67",
    "0 532 123 45 67",
    "0 (532) 123 45 67",
    "(0532) 123 45 67",
    "0532-123-45-67",
    "0532.123.45.67",
    "+905321234567",
    "+90 532 123 45 67",
    "+90 (532) 123-45-67",
    "00905321234567",
    "0090 532 123 45 67",
    "905321234567",
    "90 532 123 45 67",
    "  0532 123 45 67\n",
  ])("should accept the mobile number written as %j", (phone) => {
    expect(isValidPhone(phone)).toBe(true);
  });

  test.each([
    "0212 123 45 67",
    "0 (312) 123 45 67",
    "+90 232 123 45 67",
    "4621234567",
    "0850 123 45 67",
    "0 (800) 123 45 67",
  ])("should accept the landline or service number %j", (phone) => {
    expect(isValidPhone(phone)).toBe(true);
  });

  test.each([
    ["an area code that starts with 0", "0 (012) 123 45 67"],
    ["an area code that starts with 1", "0 (123) 456 78 90"],
    ["an area code that starts with 6", "0 (612) 123 45 67"],
    ["an area code that starts with 7", "0 (712) 123 45 67"],
    ["an area code that starts with 9", "0 (912) 123 45 67"],
    ["a number one digit short", "0532 123 45 6"],
    ["a number one digit long", "0532 123 45 678"],
    ["a seven-digit call-centre number", "444 12 34"],
    ["a subscriber number without an area code", "123 45 67"],
    ["a number of another country", "+1 202 555 0100"],
    ["a plus sign without the country code", "+0532 123 45 67"],
    ["a plus sign before a bare national number", "+5321234567"],
    ["a trunk zero after the country code", "+90 0532 123 45 67"],
    ["a plus sign inside the number", "0532+1234567"],
    ["two plus signs", "++905321234567"],
    ["letters", "0532 123 45 AB"],
    ["an extension", "0212 123 45 67 x12"],
    ["a slash as separator", "0532/123/45/67"],
    ["full-width digits", "０５３２１２３４５６７"],
    ["only a plus sign", "+"],
    ["only punctuation", "(-)"],
    ["nothing", ""],
    ["only spaces", "   "],
  ])("should reject %s", (_reason, phone) => {
    expect(isValidPhone(phone)).toBe(false);
  });

  test.each(NON_STRING_VALUES)("should reject the non-string %o", (value) => {
    expect(isValidPhone(value)).toBe(false);
  });

  test("should reject a number passed as a number or wrapped in an object", () => {
    expect(isValidPhone(5321234567)).toBe(false);
    expect(isValidPhone(new String("05321234567"))).toBe(false);
    expect(isValidPhone({ toString: () => "05321234567" })).toBe(false);
  });

  test("should answer quickly for a very long input", () => {
    expect(isValidPhone("5".repeat(1_000_000))).toBe(false);
    expect(isValidPhone(`${" ".repeat(1_000_000)}x`)).toBe(false);
  });
});
