import { describe, expect, test } from "vitest";

import normalizePhone from "../lib/modules/normalize-phone";
import NON_STRINGS from "./support/non-strings";

describe("normalizePhone", () => {
  test.each([
    "05321234567",
    "5321234567",
    "0 (532) 123 45 67",
    "0532-123-45-67",
    "+905321234567",
    "+90 532 123 45 67",
    "0090 532 123 45 67",
    "90 532 123 45 67",
    "  0532.123.45.67  ",
  ])("should write %j in E.164 form", (phone) => {
    expect(normalizePhone(phone)).toBe("+905321234567");
  });

  test("should normalize landline and service numbers the same way", () => {
    expect(normalizePhone("0 (212) 123 45 67")).toBe("+902121234567");
    expect(normalizePhone("0850 123 45 67")).toBe("+908501234567");
  });

  test("should return an E.164 number unchanged", () => {
    expect(normalizePhone("+905321234567")).toBe("+905321234567");
  });

  test("should return null for text that is not a Turkish phone number", () => {
    expect(normalizePhone("")).toBeNull();
    expect(normalizePhone("0532 123 45 6")).toBeNull();
    expect(normalizePhone("444 12 34")).toBeNull();
    expect(normalizePhone("+44 20 7946 0958")).toBeNull();
    expect(normalizePhone("ara beni")).toBeNull();
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => normalizePhone(value as string)).toThrow(
        new TypeError(`normalizePhone: expected a string, received ${received}`)
      );
    }
  );
});
