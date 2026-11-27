import { describe, expect, test } from "vitest";

import liraInWords from "../lib/modules/lira-in-words";

describe("liraInWords", () => {
  test.each([
    [123456, "bin iki yüz otuz dört lira elli altı kuruş"],
    [0, "sıfır lira"],
    [-0, "sıfır lira"],
    [5, "beş kuruş"],
    [100, "bir lira"],
    [1110, "on bir lira on kuruş"],
    [10000, "yüz lira"],
    [100000, "bin lira"],
    [200000, "iki bin lira"],
    [99999, "dokuz yüz doksan dokuz lira doksan dokuz kuruş"],
    [100000000, "bir milyon lira"],
    [100100000, "bir milyon bin lira"],
    [100000100, "bir milyon bir lira"],
    [
      123456789,
      "bir milyon iki yüz otuz dört bin beş yüz altmış yedi lira seksen dokuz kuruş",
    ],
    [200000000000, "iki milyar lira"],
    [100000000000000, "bir trilyon lira"],
    [-1250, "eksi on iki lira elli kuruş"],
  ])("should spell %j kuruş as %j", (kurus, expected) => {
    expect(liraInWords(kurus)).toBe(expected);
  });

  test("should spell the largest bigint amount it can name", () => {
    const words = liraInWords((10n ** 21n - 1n) * 100n + 99n);
    expect(
      words.startsWith(
        "dokuz yüz doksan dokuz kentilyon dokuz yüz doksan dokuz katrilyon"
      )
    ).toBe(true);
    expect(
      words.endsWith("dokuz yüz doksan dokuz lira doksan dokuz kuruş")
    ).toBe(true);
    expect(liraInWords(10n ** 18n * 100n)).toBe("bir kentilyon lira");
  });

  test("should throw a RangeError beyond the scale words", () => {
    expect(() => liraInWords(10n ** 21n * 100n)).toThrow(RangeError);
    expect(() => liraInWords(-(10n ** 21n) * 100n)).toThrow(RangeError);
  });

  test("should reject amounts that are not integer kuruş", () => {
    expect(() => liraInWords(1.5)).toThrow(RangeError);
    expect(() => liraInWords(NaN)).toThrow(RangeError);
    expect(() => liraInWords("1" as unknown as number)).toThrow(TypeError);
  });
});
