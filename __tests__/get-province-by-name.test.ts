import { describe, expect, test } from "vitest";

import foldText from "../lib/modules/fold-text";
import getProvinceByName from "../lib/modules/get-province-by-name";
import PROVINCES from "../lib/modules/provinces";
import toLowerCase from "../lib/modules/to-lower-case";
import toUpperCase from "../lib/modules/to-upper-case";
import NON_STRINGS from "./support/non-strings";

describe("getProvinceByName", () => {
  test("should find a province by its exact name", () => {
    expect(getProvinceByName("İstanbul")).toEqual({
      code: 34,
      name: "İstanbul",
    });
    expect(getProvinceByName("Ankara")).toEqual({ code: 6, name: "Ankara" });
  });

  test("should ignore case in both Turkish and English keyboards' spellings", () => {
    const istanbul = { code: 34, name: "İstanbul" };
    expect(getProvinceByName("istanbul")).toEqual(istanbul);
    expect(getProvinceByName("İSTANBUL")).toEqual(istanbul);
    expect(getProvinceByName("ISTANBUL")).toEqual(istanbul);
    expect(getProvinceByName("Istanbul")).toEqual(istanbul);
    expect(getProvinceByName("ıstanbul")).toEqual(istanbul);
  });

  test("should find a name typed without its Turkish letters", () => {
    expect(getProvinceByName("sanliurfa")).toEqual({
      code: 63,
      name: "Şanlıurfa",
    });
    expect(getProvinceByName("Canakkale")).toEqual({
      code: 17,
      name: "Çanakkale",
    });
    expect(getProvinceByName("IGDIR")).toEqual({ code: 76, name: "Iğdır" });
    expect(getProvinceByName("gumushane")).toEqual({
      code: 29,
      name: "Gümüşhane",
    });
  });

  test("should ignore spaces around the name", () => {
    expect(getProvinceByName("  İzmir\n")).toEqual({ code: 35, name: "İzmir" });
  });

  test("should find every province by any spelling and return the entry of the list itself", () => {
    for (const province of PROVINCES) {
      expect(getProvinceByName(province.name)).toBe(province);
      expect(getProvinceByName(toUpperCase(province.name))).toBe(province);
      expect(getProvinceByName(toLowerCase(province.name))).toBe(province);
      expect(getProvinceByName(foldText(province.name))).toBe(province);
      expect(getProvinceByName(province.name.toUpperCase())).toBe(province);
    }
  });

  test("should return null for a name that is not a province", () => {
    expect(getProvinceByName("Atlantis")).toBeNull();
    expect(getProvinceByName("")).toBeNull();
    expect(getProvinceByName("   ")).toBeNull();
    expect(getProvinceByName("34")).toBeNull();
    expect(getProvinceByName("constructor")).toBeNull();
    expect(getProvinceByName("__proto__")).toBeNull();
  });

  test("should not match a part of a name or a name with extra text", () => {
    expect(getProvinceByName("İst")).toBeNull();
    expect(getProvinceByName("İstanbul ili")).toBeNull();
    expect(getProvinceByName("Kahraman Maraş")).toBeNull();
  });

  test("should not know former or short names", () => {
    expect(getProvinceByName("İçel")).toBeNull();
    expect(getProvinceByName("Afyon")).toBeNull();
    expect(getProvinceByName("Urfa")).toBeNull();
    expect(getProvinceByName("Antep")).toBeNull();
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => getProvinceByName(value as string)).toThrow(
        new TypeError(
          `getProvinceByName: expected a string, received ${received}`
        )
      );
    }
  );
});
