import { describe, expect, test } from "vitest";

import provinceByPlate from "../lib/modules/province-by-plate";
import PROVINCES from "../lib/modules/provinces";

describe("provinceByPlate", () => {
  test.each([
    [34, "İstanbul"],
    ["06", "Ankara"],
    ["6", "Ankara"],
    [" 81 ", "Düzce"],
    [1, "Adana"],
  ])("should find %j → %j", (plate, name) => {
    expect(provinceByPlate(plate)?.name).toBe(name);
  });

  test("should return the shared entry", () => {
    expect(provinceByPlate(35)).toBe(PROVINCES[34]);
  });

  test.each([0, 82, -1, 1.5, NaN, Infinity, "abc", "100", "", "3.4"])(
    "should return undefined for %j",
    (plate) => {
      expect(provinceByPlate(plate)).toBeUndefined();
    }
  );

  test("should return undefined for a non-number, non-string plate", () => {
    expect(provinceByPlate(null as unknown as number)).toBeUndefined();
    expect(provinceByPlate(34n as unknown as number)).toBeUndefined();
  });
});
