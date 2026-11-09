import { describe, expect, test } from "vitest";

import foldText from "../lib/modules/fold-text";
import NON_STRINGS from "./support/non-strings";

// The search key the Han Dijit site builds in production; foldText must agree with it so an
// index written by one can be queried by the other.
const referenceKey = (text: string): string =>
  text
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

describe("foldText", () => {
  test("should fold the six Turkish letters to their ASCII neighbours", () => {
    expect(foldText("çğıöşü")).toBe("cgiosu");
    expect(foldText("ÇĞİÖŞÜ")).toBe("cgiosu");
  });

  test("should fold both capital I letters to i", () => {
    expect(foldText("I")).toBe("i");
    expect(foldText("İ")).toBe("i");
    expect(foldText("ISPARTA")).toBe("isparta");
    expect(foldText("İstanbul")).toBe("istanbul");
  });

  test("should make spellings of one word equal", () => {
    const keys = ["Şanlıurfa", "ŞANLIURFA", "sanliurfa", "SANLIURFA"].map(
      foldText
    );
    expect(new Set(keys)).toEqual(new Set(["sanliurfa"]));
  });

  test("should drop accents and combining marks", () => {
    expect(foldText("kâğıt")).toBe("kagit");
    expect(foldText("café")).toBe("cafe");
    expect(foldText("gül")).toBe("gul");
  });

  test("should keep digits, spaces and punctuation", () => {
    expect(foldText("Çay 2'li paket!")).toBe("cay 2'li paket!");
    expect(foldText("")).toBe("");
  });

  test("should agree with the production search key for every code point", () => {
    const mismatches: string[] = [];
    for (let codePoint = 0; codePoint <= 0x10ffff; codePoint += 1) {
      const character = String.fromCodePoint(codePoint);
      if (foldText(character) !== referenceKey(character)) {
        mismatches.push(codePoint.toString(16));
      }
    }
    expect(mismatches).toEqual([]);
  });

  test("should agree with the production search key for whole sentences", () => {
    for (const text of [
      "IĞDIR'ın ılık İĞDE ağaçları",
      "Çığ düşen ŞEHİR: Öğle üzeri",
      "Kâr / zarar hesabı 2026",
    ]) {
      expect(foldText(text)).toBe(referenceKey(text));
    }
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => foldText(value as string)).toThrow(
        new TypeError(`foldText: expected a string, received ${received}`)
      );
    }
  );
});
