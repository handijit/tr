import { describe, expect, test } from "vitest";

import formatPhone from "../lib/modules/format-phone";
import type { FormatPhoneOptions } from "../lib/modules/format-phone";
import normalizePhone from "../lib/modules/normalize-phone";
import NON_STRINGS from "./support/non-strings";

describe("formatPhone", () => {
  test("should print the national form by default", () => {
    expect(formatPhone("05321234567")).toBe("0 (532) 123 45 67");
    expect(formatPhone("+905321234567")).toBe("0 (532) 123 45 67");
    expect(formatPhone("5321234567", {})).toBe("0 (532) 123 45 67");
    expect(formatPhone("5321234567", { style: "national" })).toBe(
      "0 (532) 123 45 67"
    );
    expect(formatPhone("5321234567", { style: undefined })).toBe(
      "0 (532) 123 45 67"
    );
  });

  test("should print the international form on request", () => {
    expect(formatPhone("05321234567", { style: "international" })).toBe(
      "+90 532 123 45 67"
    );
    expect(formatPhone("0 (212) 123 45 67", { style: "international" })).toBe(
      "+90 212 123 45 67"
    );
  });

  test("should print landline and service numbers", () => {
    expect(formatPhone("02121234567")).toBe("0 (212) 123 45 67");
    expect(formatPhone("+90 850 123 45 67")).toBe("0 (850) 123 45 67");
  });

  test("should fall back to the national form for an unknown style", () => {
    expect(
      formatPhone("05321234567", {
        style: "e164",
      } as unknown as FormatPhoneOptions)
    ).toBe("0 (532) 123 45 67");
    expect(
      formatPhone("05321234567", {
        style: null,
      } as unknown as FormatPhoneOptions)
    ).toBe("0 (532) 123 45 67");
  });

  test("should return a formatted number unchanged", () => {
    expect(formatPhone("0 (532) 123 45 67")).toBe("0 (532) 123 45 67");
    expect(formatPhone("+90 532 123 45 67", { style: "international" })).toBe(
      "+90 532 123 45 67"
    );
  });

  test("should print a number that normalizePhone reads back", () => {
    for (const style of ["national", "international"] as const) {
      expect(
        normalizePhone(formatPhone("0532 123 45 67", { style }) as string)
      ).toBe("+905321234567");
    }
  });

  test("should return null for text that is not a Turkish phone number", () => {
    expect(formatPhone("")).toBeNull();
    expect(formatPhone("0532 123")).toBeNull();
    expect(formatPhone("444 12 34")).toBeNull();
    expect(
      formatPhone("+1 202 555 0100", { style: "international" })
    ).toBeNull();
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => formatPhone(value as string)).toThrow(
        new TypeError(`formatPhone: expected a string, received ${received}`)
      );
    }
  );
});
