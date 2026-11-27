import { describe, expect, test } from "vitest";

import foldTurkish from "../lib/modules/fold-turkish";

describe("foldTurkish", () => {
  test.each([
    ["  IŞIK  Çağrı ", "isik cagri"],
    ["İSTANBUL", "istanbul"],
    ["ISPARTA", "isparta"],
    ["Kâğıt\t\nfiyatı", "kagit fiyati"],
    ["Ön-fren, balata", "on-fren, balata"],
    ["ÖĞRENCİ öğrenci", "ogrenci ogrenci"],
    ["", ""],
    ["   ", ""],
  ])("should fold %j to %j", (text, expected) => {
    expect(foldTurkish(text)).toBe(expected);
  });

  test("should make differently typed queries meet", () => {
    expect(foldTurkish("ŞEKER")).toBe(foldTurkish("seker"));
    expect(foldTurkish("Iğdır")).toBe(foldTurkish("IGDIR"));
  });

  test("should throw a TypeError for non-string text", () => {
    expect(() => foldTurkish(undefined as unknown as string)).toThrow(
      new TypeError(
        "foldTurkish: expected text to be a string, received undefined"
      )
    );
  });
});
