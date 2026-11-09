import { describe, expect, test } from "vitest";

import MONTH_NAMES from "../lib/modules/month-names";

describe("MONTH_NAMES", () => {
  test("should list the twelve months from January", () => {
    expect(MONTH_NAMES).toEqual([
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ]);
  });

  test("should line up with Date.prototype.getMonth", () => {
    expect(MONTH_NAMES[new Date(Date.UTC(2026, 10, 10)).getUTCMonth()]).toBe(
      "Kasım"
    );
  });

  test("should agree with the names the tr-TR locale prints", () => {
    const formatter = new Intl.DateTimeFormat("tr-TR", {
      month: "long",
      timeZone: "UTC",
    });
    expect(
      MONTH_NAMES.map((_name, month) =>
        formatter.format(Date.UTC(2026, month, 15))
      )
    ).toEqual(MONTH_NAMES);
  });

  test("should be frozen", () => {
    expect(Object.isFrozen(MONTH_NAMES)).toBe(true);
    expect(() => {
      (MONTH_NAMES as string[])[0] = "January";
    }).toThrow(TypeError);
    expect(() => {
      (MONTH_NAMES as string[]).push("Onüçüncü");
    }).toThrow(TypeError);
    expect(MONTH_NAMES).toHaveLength(12);
  });
});
