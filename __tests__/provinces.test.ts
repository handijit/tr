import { describe, expect, test } from "vitest";

import PROVINCES from "../lib/modules/provinces";
import type { Province } from "../lib/types";

describe("PROVINCES", () => {
  test("should list all 81 provinces", () => {
    expect(PROVINCES).toHaveLength(81);
  });

  test("should number them 1 to 81 in order", () => {
    expect(PROVINCES.map((province) => province.code)).toEqual(
      Array.from({ length: 81 }, (_unused, index) => index + 1)
    );
  });

  test("should put each province at the index one below its code", () => {
    expect(PROVINCES[0]).toEqual({ code: 1, name: "Adana" });
    expect(PROVINCES[5]).toEqual({ code: 6, name: "Ankara" });
    expect(PROVINCES[33]).toEqual({ code: 34, name: "İstanbul" });
    expect(PROVINCES[34]).toEqual({ code: 35, name: "İzmir" });
    expect(PROVINCES[80]).toEqual({ code: 81, name: "Düzce" });
  });

  test("should carry the codes that break alphabetical order", () => {
    const nameOf = (code: number): string | undefined =>
      PROVINCES[code - 1]?.name;
    expect(nameOf(33)).toBe("Mersin");
    expect(nameOf(46)).toBe("Kahramanmaraş");
    expect(nameOf(63)).toBe("Şanlıurfa");
    expect([68, 69, 70, 71, 72, 73, 74].map(nameOf)).toEqual([
      "Aksaray",
      "Bayburt",
      "Karaman",
      "Kırıkkale",
      "Batman",
      "Şırnak",
      "Bartın",
    ]);
    expect([75, 76, 77, 78, 79, 80].map(nameOf)).toEqual([
      "Ardahan",
      "Iğdır",
      "Yalova",
      "Karabük",
      "Kilis",
      "Osmaniye",
    ]);
  });

  test("should spell names with their Turkish letters", () => {
    const names = PROVINCES.map((province) => province.name);
    for (const name of [
      "Ağrı",
      "Çanakkale",
      "Diyarbakır",
      "Eskişehir",
      "Gümüşhane",
      "Iğdır",
      "Isparta",
      "Kütahya",
      "Muğla",
      "Nevşehir",
      "Tekirdağ",
      "Uşak",
    ]) {
      expect(names).toContain(name);
    }
  });

  test("should not repeat a name", () => {
    expect(new Set(PROVINCES.map((province) => province.name)).size).toBe(81);
  });

  test("should write every name trimmed and capitalised", () => {
    for (const { name } of PROVINCES) {
      expect(name).toMatch(/^\p{Lu}\p{Ll}+$/u);
    }
  });

  test("should be frozen all the way down", () => {
    expect(Object.isFrozen(PROVINCES)).toBe(true);
    expect(PROVINCES.every((province) => Object.isFrozen(province))).toBe(true);
    expect(() => {
      (PROVINCES as Province[]).push({ code: 82, name: "Atlantis" });
    }).toThrow(TypeError);
    expect(() => {
      (PROVINCES[0] as { name: string }).name = "Seyhan";
    }).toThrow(TypeError);
    expect(PROVINCES[0]).toEqual({ code: 1, name: "Adana" });
  });
});
