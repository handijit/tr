import { describe, expect, test } from "vitest";

import DAY_NAMES from "../lib/modules/day-names";

describe("DAY_NAMES", () => {
  test("should list the seven days from Monday", () => {
    expect(DAY_NAMES).toEqual([
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
      "Pazar",
    ]);
  });

  test("should agree with the names the tr-TR locale prints", () => {
    const formatter = new Intl.DateTimeFormat("tr-TR", {
      weekday: "long",
      timeZone: "UTC",
    });
    // 9 November 2026 is a Monday.
    expect(
      DAY_NAMES.map((_name, offset) =>
        formatter.format(Date.UTC(2026, 10, 9 + offset))
      )
    ).toEqual(DAY_NAMES);
  });

  test("should be frozen", () => {
    expect(Object.isFrozen(DAY_NAMES)).toBe(true);
    expect(() => {
      (DAY_NAMES as string[])[0] = "Monday";
    }).toThrow(TypeError);
    expect(() => {
      (DAY_NAMES as string[]).reverse();
    }).toThrow(TypeError);
    expect(DAY_NAMES[0]).toBe("Pazartesi");
  });
});
