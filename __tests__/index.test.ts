import { describe, expect, test } from "vitest";

import * as api from "../lib/index";

const EXPECTED_FUNCTIONS = [
  "addVat",
  "compareTr",
  "foldTurkish",
  "formatDateTr",
  "formatIban",
  "formatLira",
  "formatPhone",
  "isIban",
  "isMobilePhone",
  "isTckn",
  "isVkn",
  "liraInWords",
  "normalizePhone",
  "parseDateTr",
  "parseLira",
  "provinceByPlate",
  "removeVat",
  "slugify",
  "toLowerTr",
  "toUpperTr",
  "vatOf",
] as const;

describe("public entry point", () => {
  test("should expose every documented function", () => {
    for (const name of EXPECTED_FUNCTIONS) {
      expect(typeof api[name]).toBe("function");
    }
  });

  test("should expose exactly the documented surface", () => {
    expect(Object.keys(api).sort()).toEqual(
      [...EXPECTED_FUNCTIONS, "PROVINCES"].sort()
    );
  });

  test("should work through the barrel", () => {
    expect(api.slugify("Ön Fren Balatası")).toBe("on-fren-balatasi");
    expect(api.formatLira(api.addVat(api.parseLira("1.000") ?? 0, 20))).toBe(
      "₺1.200,00"
    );
    expect(api.provinceByPlate("34")).toBe(api.PROVINCES[33]);
  });
});
