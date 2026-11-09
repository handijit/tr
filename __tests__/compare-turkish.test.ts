import { describe, expect, test } from "vitest";

import compareTurkish from "../lib/modules/compare-turkish";
import NON_STRINGS from "./support/non-strings";

const WORDS = [
  "ağaç",
  "Ağrı",
  "ada",
  "Adana",
  "çay",
  "cam",
  "Cem",
  "çim",
  "dağ",
  "diş",
  "dış",
  "elma",
  "göl",
  "gül",
  "ğ",
  "ırmak",
  "ılık",
  "iğne",
  "İzmir",
  "Isparta",
  "İstanbul",
  "kar",
  "kâr",
  "kır",
  "kir",
  "oda",
  "öğle",
  "ödev",
  "su",
  "şu",
  "şeker",
  "sek",
  "un",
  "ün",
  "üzüm",
  "uzun",
  "Zonguldak",
  "Şırnak",
  "Iğdır",
  "Ig",
  "ıg",
  "ig",
  "İg",
  "a",
  "A",
  "Ç",
  "ç",
  "c",
  "C",
  "web",
  "xeno",
  "quiz",
  "pa",
  "ra",
  "Ali",
  "ali",
  "ALİ",
  "1",
  "2",
  "10",
  "a1",
  "a b",
  "ab",
  "a-b",
  "",
];

describe("compareTurkish", () => {
  test("should put the Turkish letters in alphabet order", () => {
    const shuffled = [..."zşaıçgöüibğocdsuefhjklmnprtvy"];
    expect(shuffled.sort(compareTurkish).join("")).toBe(
      "abcçdefgğhıijklmnoöprsştuüvyz"
    );
  });

  test("should place q, w and x where the Latin alphabet has them", () => {
    expect(["r", "x", "p", "w", "q", "y", "v"].sort(compareTurkish)).toEqual([
      "p",
      "q",
      "r",
      "v",
      "w",
      "x",
      "y",
    ]);
  });

  test("should sort ı before i and I before İ", () => {
    expect(compareTurkish("ılık", "ilik")).toBe(-1);
    expect(compareTurkish("Isparta", "İstanbul")).toBe(-1);
    expect(compareTurkish("İzmir", "Iğdır")).toBe(1);
  });

  test("should sort a list of province names the way a Turkish dictionary does", () => {
    expect(
      ["Zonguldak", "Şırnak", "Çorum", "İzmir", "Iğdır", "Ağrı", "Adana"].sort(
        compareTurkish
      )
    ).toEqual([
      "Adana",
      "Ağrı",
      "Çorum",
      "Iğdır",
      "İzmir",
      "Şırnak",
      "Zonguldak",
    ]);
  });

  test("should return 0 for equal texts", () => {
    expect(compareTurkish("çay", "çay")).toBe(0);
    expect(compareTurkish("", "")).toBe(0);
  });

  test("should treat a composed and a decomposed letter as the same letter", () => {
    expect(compareTurkish("göl", "göl")).toBe(0);
    expect(compareTurkish("göl", "gol")).toBe(1);
  });

  test("should sort a shorter text before a longer one that starts with it", () => {
    expect(compareTurkish("ev", "evler")).toBe(-1);
    expect(compareTurkish("evler", "ev")).toBe(1);
    expect(compareTurkish("", "a")).toBe(-1);
  });

  test("should ignore case unless the letters are the same", () => {
    expect(compareTurkish("ali", "Veli")).toBe(-1);
    expect(compareTurkish("Zeynep", "ali")).toBe(1);
    expect(compareTurkish("ali", "Ali")).toBe(-1);
    expect(compareTurkish("Ali", "ali")).toBe(1);
    expect(compareTurkish("Ali", "ALİ")).toBe(-1);
  });

  test("should let an accent break a tie only", () => {
    expect(compareTurkish("kar", "kâr")).toBe(-1);
    expect(compareTurkish("kâr", "kar")).toBe(1);
    expect(compareTurkish("kâr", "kas")).toBe(-1);
  });

  test("should sort punctuation before digits and digits before letters", () => {
    expect(["a", "1", "-", "ç", " "].sort(compareTurkish)).toEqual([
      " ",
      "-",
      "1",
      "a",
      "ç",
    ]);
    expect(compareTurkish("a b", "ab")).toBe(-1);
    expect(compareTurkish("10", "2")).toBe(-1);
  });

  test("should sort other scripts and symbols after the Latin letters", () => {
    // Among themselves they keep code point order: "я" is U+044F, "€" is U+20AC.
    expect(["€", "я", "z", "ş"].sort(compareTurkish)).toEqual([
      "ş",
      "z",
      "я",
      "€",
    ]);
  });

  test("should weigh a combining mark that has no composed letter as nothing", () => {
    expect(compareTurkish("q́a", "qb")).toBe(-1);
    expect(compareTurkish("q", "q́")).toBe(-1);
    expect(compareTurkish("q́", "q")).toBe(1);
  });

  test("should still order two capital forms of one letter", () => {
    // "Ǆ" and "ǅ" lower-case to the same letter and neither is lower case.
    expect(compareTurkish("Ǆ", "ǅ")).toBe(-1);
    expect(compareTurkish("ǅ", "Ǆ")).toBe(1);
  });

  test("should agree with the tr-TR collator on Turkish words", () => {
    const collator = new Intl.Collator("tr-TR");
    const disagreements: string[] = [];
    for (const left of WORDS) {
      for (const right of WORDS) {
        const expected = Math.sign(collator.compare(left, right));
        if (compareTurkish(left, right) !== expected) {
          disagreements.push(`${left} / ${right}`);
        }
      }
    }
    expect(disagreements).toEqual([]);
  });

  test("should be a consistent total order", () => {
    for (const left of WORDS) {
      for (const right of WORDS) {
        const forward = compareTurkish(left, right);
        // `0 - x` rather than `-x`: negating 0 gives -0, which toBe tells apart from 0.
        expect(compareTurkish(right, left)).toBe(0 - forward);
        expect(forward === 0).toBe(left === right);
      }
    }
    const sorted = [...WORDS].sort(compareTurkish);
    for (let i = 0; i < sorted.length; i += 1) {
      for (let j = i + 1; j < sorted.length; j += 1) {
        expect(compareTurkish(sorted[i] as string, sorted[j] as string)).toBe(
          -1
        );
      }
    }
  });

  test("should not change the texts it compares or the list being sorted in place only", () => {
    const names = Object.freeze(["Şule", "Çağla", "Can"]);
    expect([...names].sort(compareTurkish)).toEqual(["Can", "Çağla", "Şule"]);
    expect(names).toEqual(["Şule", "Çağla", "Can"]);
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o on either side",
    (value, received) => {
      const error = new TypeError(
        `compareTurkish: expected a string, received ${received}`
      );
      expect(() => compareTurkish(value as string, "a")).toThrow(error);
      expect(() => compareTurkish("a", value as string)).toThrow(error);
    }
  );
});
