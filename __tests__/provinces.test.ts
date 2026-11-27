import { describe, expect, test } from "vitest";

import PROVINCES from "../lib/modules/provinces";
import type { Province } from "../lib/types";

describe("PROVINCES", () => {
  test("should list 81 provinces ordered by plate code", () => {
    expect(PROVINCES).toHaveLength(81);
    PROVINCES.forEach((province, index) => {
      expect(province.plate).toBe(index + 1);
    });
  });

  test("should hold unique names", () => {
    expect(new Set(PROVINCES.map(({ name }) => name)).size).toBe(81);
  });

  test("should spell names with Turkish letters", () => {
    expect(PROVINCES[33]).toEqual({ plate: 34, name: "İstanbul" });
    expect(PROVINCES[75]).toEqual({ plate: 76, name: "Iğdır" });
    expect(PROVINCES[80]).toEqual({ plate: 81, name: "Düzce" });
  });

  test("should be frozen, list and entries", () => {
    expect(Object.isFrozen(PROVINCES)).toBe(true);
    expect(PROVINCES.every((province) => Object.isFrozen(province))).toBe(true);
    expect(() => {
      (PROVINCES as Province[]).push({ plate: 82, name: "X" });
    }).toThrow(TypeError);
  });
});
