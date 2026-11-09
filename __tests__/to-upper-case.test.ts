import { describe, expect, test } from "vitest";

import toUpperCase from "../lib/modules/to-upper-case";
import NON_STRINGS from "./support/non-strings";

describe("toUpperCase", () => {
  test("should write a dotted i as a dotted capital", () => {
    expect(toUpperCase("istanbul")).toBe("İSTANBUL");
    expect(toUpperCase("i")).toBe("İ");
  });

  test("should write a dotless ı as a dotless capital", () => {
    expect(toUpperCase("ılık")).toBe("ILIK");
    expect(toUpperCase("ığdır")).toBe("IĞDIR");
  });

  test("should upper-case the whole Turkish alphabet", () => {
    expect(toUpperCase("abcçdefgğhıijklmnoöprsştuüvyz")).toBe(
      "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ"
    );
  });

  test("should leave capitals, digits, punctuation and spaces alone", () => {
    expect(toUpperCase("İSTANBUL 34, TR!")).toBe("İSTANBUL 34, TR!");
    expect(toUpperCase("")).toBe("");
    expect(toUpperCase(" \t\n")).toBe(" \t\n");
  });

  test("should follow the Unicode rules for letters outside Turkish", () => {
    expect(toUpperCase("straße")).toBe("STRASSE");
    expect(toUpperCase("\u{10428}")).toBe("\u{10400}");
    expect(toUpperCase("\ud800i")).toBe("\ud800İ");
  });

  test("should give what the tr-TR locale gives for every code point", () => {
    const mismatches: string[] = [];
    for (let codePoint = 0; codePoint <= 0x10ffff; codePoint += 1) {
      const character = String.fromCodePoint(codePoint);
      if (toUpperCase(character) !== character.toLocaleUpperCase("tr-TR")) {
        mismatches.push(codePoint.toString(16));
      }
    }
    expect(mismatches).toEqual([]);
  });

  test("should give what the tr-TR locale gives for whole sentences", () => {
    for (const text of [
      "ısparta'nın ılık iğde ağaçları",
      "Diyarbakır ve İzmir",
      "çığ, şiir, öğüt, ünlü",
      "i̇",
    ]) {
      expect(toUpperCase(text)).toBe(text.toLocaleUpperCase("tr-TR"));
    }
  });

  test("should handle a very long text", () => {
    expect(toUpperCase("ıi".repeat(500_000))).toBe("Iİ".repeat(500_000));
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => toUpperCase(value as string)).toThrow(
        new TypeError(`toUpperCase: expected a string, received ${received}`)
      );
    }
  );
});
