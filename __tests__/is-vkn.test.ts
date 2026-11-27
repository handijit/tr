import { describe, expect, test } from "vitest";

import isVkn from "../lib/modules/is-vkn";

describe("isVkn", () => {
  // 0123456789 exercises the "multiple of 9 counts as 9" rule, 1234567890 the zero-shift case.
  test.each(["1234567890", "0123456789", "9876543217", "1111111114"])(
    "should accept %j",
    (value) => {
      expect(isVkn(value)).toBe(true);
    }
  );

  test.each([
    "1234567891",
    "0123456780",
    "123456789",
    "12345678901",
    "123456789a",
    "",
  ])("should reject %j", (value) => {
    expect(isVkn(value)).toBe(false);
  });

  test.each([1234567890, null, undefined])(
    "should return false for non-string %j",
    (value) => {
      expect(isVkn(value)).toBe(false);
    }
  );
});
