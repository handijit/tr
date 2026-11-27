import { describe, expect, test } from "vitest";

import formatPhone from "../lib/modules/format-phone";

describe("formatPhone", () => {
  test("should format for display", () => {
    expect(formatPhone("+905321234567")).toBe("0532 123 45 67");
    expect(formatPhone("2121234567")).toBe("0212 123 45 67");
  });

  test.each(["123", "", null])("should return undefined for %j", (value) => {
    expect(formatPhone(value)).toBeUndefined();
  });
});
