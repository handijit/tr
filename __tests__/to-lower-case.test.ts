import { describe, expect, test } from "vitest";

import toLowerCase from "../lib/modules/to-lower-case";
import NON_STRINGS from "./support/non-strings";

describe("toLowerCase", () => {
  test("should write a dotless capital I as a dotless ı", () => {
    expect(toLowerCase("ILIK")).toBe("ılık");
    expect(toLowerCase("IĞDIR")).toBe("ığdır");
  });

  test("should write a dotted capital İ as a plain i", () => {
    expect(toLowerCase("İSTANBUL")).toBe("istanbul");
    // The platform default leaves a combining dot behind: "i̇".
    expect(toLowerCase("İ")).toHaveLength(1);
  });

  test("should read a decomposed İ as one letter", () => {
    expect(toLowerCase("İSTANBUL")).toBe("istanbul");
    expect(toLowerCase("İİ")).toBe("ii");
  });

  test("should lower-case the whole Turkish alphabet", () => {
    expect(toLowerCase("ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ")).toBe(
      "abcçdefgğhıijklmnoöprsştuüvyz"
    );
  });

  test("should leave lower-case letters, digits and punctuation alone", () => {
    expect(toLowerCase("ılık istanbul 34, tr!")).toBe("ılık istanbul 34, tr!");
    expect(toLowerCase("")).toBe("");
  });

  test("should follow the Unicode rules for letters outside Turkish", () => {
    expect(toLowerCase("ΟΔΥΣΣΕΥΣ")).toBe("οδυσσευς");
    expect(toLowerCase("\u{10400}")).toBe("\u{10428}");
    expect(toLowerCase("\ud800I")).toBe("\ud800ı");
  });

  test("should give what the tr-TR locale gives for every code point", () => {
    const mismatches: string[] = [];
    for (let codePoint = 0; codePoint <= 0x10ffff; codePoint += 1) {
      const character = String.fromCodePoint(codePoint);
      if (toLowerCase(character) !== character.toLocaleLowerCase("tr-TR")) {
        mismatches.push(codePoint.toString(16));
      }
    }
    expect(mismatches).toEqual([]);
  });

  test("should give what the tr-TR locale gives for whole sentences", () => {
    for (const text of [
      "ISPARTA'NIN ILIK İĞDE AĞAÇLARI",
      "DİYARBAKIR VE İZMİR",
      "ÇIĞ, ŞİİR, ÖĞÜT, ÜNLÜ",
      "İZMİR",
    ]) {
      expect(toLowerCase(text)).toBe(text.toLocaleLowerCase("tr-TR"));
    }
  });

  test("should handle a very long text", () => {
    expect(toLowerCase("Iİ".repeat(500_000))).toBe("ıi".repeat(500_000));
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => toLowerCase(value as string)).toThrow(
        new TypeError(`toLowerCase: expected a string, received ${received}`)
      );
    }
  );
});
