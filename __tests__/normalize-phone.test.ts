import { describe, expect, test } from "vitest";

import normalizePhone from "../lib/modules/normalize-phone";

describe("normalizePhone", () => {
  test.each([
    "05321234567",
    "5321234567",
    "+905321234567",
    "905321234567",
    "00905321234567",
    "0 (532) 123 45 67",
    "0532-123-45-67",
    "0532.123.45.67",
    "+90 532 123 45 67",
    " 0532 123 45 67 ",
  ])("should normalize %j", (value) => {
    expect(normalizePhone(value)).toBe("+905321234567");
  });

  test("should accept landline and 850 numbers", () => {
    expect(normalizePhone("0212 123 45 67")).toBe("+902121234567");
    expect(normalizePhone("0850 123 45 67")).toBe("+908501234567");
  });

  test.each([
    "",
    "0532123456",
    "053212345678",
    "01231234567",
    "06321234567",
    "+44 20 7946 0958",
    "+90 0532 123 45 67",
    "0532 123 45 6a",
    "abc",
  ])("should reject %j", (value) => {
    expect(normalizePhone(value)).toBeUndefined();
  });

  test.each([5321234567, null, undefined])(
    "should return undefined for non-string %j",
    (value) => {
      expect(normalizePhone(value)).toBeUndefined();
    }
  );
});
