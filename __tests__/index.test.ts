import { describe, expect, test } from "vitest";

import * as api from "../lib/index";

const EXPECTED_EXPORTS = [
  "capitalize",
  "compareTurkish",
  "DAY_NAMES",
  "foldText",
  "formatDate",
  "formatDateTime",
  "formatIban",
  "formatMoney",
  "formatPhone",
  "getDayName",
  "getMonthName",
  "getPhoneType",
  "getProvinceByCode",
  "getProvinceByName",
  "isValidIban",
  "isValidLicensePlate",
  "isValidPhone",
  "isValidTckn",
  "isValidVkn",
  "moneyToWords",
  "MONTH_NAMES",
  "normalizeIban",
  "normalizePhone",
  "parseDate",
  "parseMoney",
  "PROVINCES",
  "slugify",
  "toLowerCase",
  "toTitleCase",
  "toUpperCase",
] as const;

describe("public entry point", () => {
  test("should expose exactly the documented surface", () => {
    expect(Object.keys(api).sort()).toEqual([...EXPECTED_EXPORTS].sort());
  });

  test("should have no default export", () => {
    expect("default" in api).toBe(false);
  });

  test("should expose functions and frozen lists only", () => {
    for (const name of EXPECTED_EXPORTS) {
      const value: unknown = api[name];
      if (typeof value !== "function") {
        expect(Object.isFrozen(value), name).toBe(true);
      }
    }
  });

  test("should work through the barrel for text", () => {
    expect(api.toUpperCase("iyi günler")).toBe("İYİ GÜNLER");
    expect(api.toLowerCase("IŞIK")).toBe("ışık");
    expect(api.capitalize("izmir")).toBe("İzmir");
    expect(api.toTitleCase("ığdır valiliği")).toBe("Iğdır Valiliği");
    expect(api.foldText("Çağrı")).toBe("cagri");
    expect(api.slugify("Ön Muhasebe")).toBe("on-muhasebe");
    expect(["Çorum", "Bolu", "Ağrı"].sort(api.compareTurkish)).toEqual([
      "Ağrı",
      "Bolu",
      "Çorum",
    ]);
  });

  test("should work through the barrel for identity, bank and phone numbers", () => {
    expect(api.isValidTckn("10000000146")).toBe(true);
    expect(api.isValidVkn("1234567890")).toBe(true);
    expect(api.isValidIban("TR33 0006 1005 1978 6457 8413 26")).toBe(true);
    expect(api.normalizeIban("tr33 0006 1005 1978 6457 8413 26")).toBe(
      "TR330006100519786457841326"
    );
    expect(api.formatIban("TR330006100519786457841326")).toBe(
      "TR33 0006 1005 1978 6457 8413 26"
    );
    expect(api.isValidPhone("0532 123 45 67")).toBe(true);
    expect(api.getPhoneType("0212 123 45 67")).toBe("landline");
    expect(api.normalizePhone("0532 123 45 67")).toBe("+905321234567");
    expect(api.formatPhone("+905321234567")).toBe("0 (532) 123 45 67");
  });

  test("should work through the barrel for money and dates", () => {
    expect(api.formatMoney(349000)).toBe("3.490,00 TL");
    expect(api.parseMoney("3.490,50")).toBe(349050);
    expect(api.moneyToWords(349050)).toBe(
      "üç bin dört yüz doksan Türk lirası elli kuruş"
    );
    expect(api.formatDate("2026-11-10")).toBe("10.11.2026");
    expect(api.formatDateTime(new Date("2026-11-10T11:30:00Z"))).toBe(
      "10.11.2026 14:30"
    );
    expect(api.parseDate("10.11.2026")).toBe("2026-11-10");
    expect(api.getMonthName("2026-11-10")).toBe("Kasım");
    expect(api.getDayName("2026-11-10")).toBe("Salı");
    expect(api.MONTH_NAMES[10]).toBe("Kasım");
    expect(api.DAY_NAMES[1]).toBe("Salı");
  });

  test("should work through the barrel for provinces and plates", () => {
    expect(api.PROVINCES).toHaveLength(81);
    expect(api.getProvinceByCode(34)).toBe(api.PROVINCES[33]);
    expect(api.getProvinceByName("ankara")).toBe(api.PROVINCES[5]);
    expect(api.isValidLicensePlate("34 ABC 123")).toBe(true);
  });
});
