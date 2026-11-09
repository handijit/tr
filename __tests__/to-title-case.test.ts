import { describe, expect, test } from "vitest";

import toTitleCase from "../lib/modules/to-title-case";
import NON_STRINGS from "./support/non-strings";

describe("toTitleCase", () => {
  test("should capitalise every word by the Turkish rules", () => {
    expect(toTitleCase("ısparta ili iğdır ilçesi")).toBe(
      "Isparta İli İğdır İlçesi"
    );
    expect(toTitleCase("çağrı öztürk")).toBe("Çağrı Öztürk");
  });

  test("should lower-case the rest of each word", () => {
    expect(toTitleCase("İSTANBUL IĞDIR DİYARBAKIR")).toBe(
      "İstanbul Iğdır Diyarbakır"
    );
    expect(toTitleCase("aHMET yILMAZ")).toBe("Ahmet Yılmaz");
  });

  test("should capitalise short words such as ve and ile too", () => {
    expect(toTitleCase("stok ve cari takip")).toBe("Stok Ve Cari Takip");
  });

  test("should start a new word after a hyphen, a slash or a bracket", () => {
    expect(toTitleCase("istanbul-izmir yolu")).toBe("İstanbul-İzmir Yolu");
    expect(toTitleCase("alış/satış (iade)")).toBe("Alış/Satış (İade)");
  });

  test("should not start a new word after an apostrophe or a digit", () => {
    expect(toTitleCase("ankara'da")).toBe("Ankara'da");
    expect(toTitleCase("izmir’in")).toBe("İzmir’in");
    expect(toTitleCase("3a blok")).toBe("3a Blok");
  });

  test("should not split a word at a combining mark", () => {
    expect(toTitleCase("gül")).toBe("Gül");
  });

  test("should keep the spacing of the text", () => {
    expect(toTitleCase("  iki   boşluk\tsekme\n")).toBe(
      "  İki   Boşluk\tSekme\n"
    );
    expect(toTitleCase("")).toBe("");
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => toTitleCase(value as string)).toThrow(
        new TypeError(`toTitleCase: expected a string, received ${received}`)
      );
    }
  );
});
