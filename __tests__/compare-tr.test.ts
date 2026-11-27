import { describe, expect, test } from "vitest";

import compareTr from "../lib/modules/compare-tr";

describe("compareTr", () => {
  test("should sort in Turkish alphabetical order", () => {
    expect(
      ["d", "ç", "c", "i", "ı", "h", "ş", "s", "z"].sort(compareTr)
    ).toEqual(["c", "ç", "d", "h", "ı", "i", "s", "ş", "z"]);
    expect(
      ["Zeynep", "Çiğdem", "Ceren", "Ömer", "Oya"].sort(compareTr)
    ).toEqual(["Ceren", "Çiğdem", "Oya", "Ömer", "Zeynep"]);
  });

  test("should return zero for equal strings and a sign otherwise", () => {
    expect(compareTr("ağaç", "ağaç")).toBe(0);
    expect(compareTr("a", "b")).toBeLessThan(0);
    expect(compareTr("b", "a")).toBeGreaterThan(0);
    expect(compareTr("", "")).toBe(0);
  });

  test("should throw a TypeError naming the bad argument", () => {
    expect(() => compareTr(1 as unknown as string, "a")).toThrow(
      new TypeError("compareTr: expected a to be a string, received number")
    );
    expect(() => compareTr("a", null as unknown as string)).toThrow(
      new TypeError("compareTr: expected b to be a string, received null")
    );
  });
});
