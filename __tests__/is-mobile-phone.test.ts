import { describe, expect, test } from "vitest";

import isMobilePhone from "../lib/modules/is-mobile-phone";

describe("isMobilePhone", () => {
  test("should accept mobile numbers in any accepted form", () => {
    expect(isMobilePhone("0532 123 45 67")).toBe(true);
    expect(isMobilePhone("+905051234567")).toBe(true);
  });

  test.each(["0212 123 45 67", "0850 123 45 67", "garbage", "", 5321234567])(
    "should reject %j",
    (value) => {
      expect(isMobilePhone(value)).toBe(false);
    }
  );
});
