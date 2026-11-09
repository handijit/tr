import { describe, expect, test } from "vitest";

import moneyToWords from "../lib/modules/money-to-words";
import { NON_NUMBERS, UNSAFE_AMOUNTS } from "./support/non-numbers";

describe("moneyToWords", () => {
  test("should spell lira and kuruş", () => {
    expect(moneyToWords(349050)).toBe(
      "üç bin dört yüz doksan Türk lirası elli kuruş"
    );
  });

  test("should spell zero with its unit", () => {
    expect(moneyToWords(0)).toBe("sıfır Türk lirası");
    expect(moneyToWords(-0)).toBe("sıfır Türk lirası");
  });

  test("should leave the kuruş out of a whole lira amount", () => {
    expect(moneyToWords(100)).toBe("bir Türk lirası");
    expect(moneyToWords(349000)).toBe("üç bin dört yüz doksan Türk lirası");
  });

  test("should leave the lira out of an amount below one lira", () => {
    expect(moneyToWords(1)).toBe("bir kuruş");
    expect(moneyToWords(50)).toBe("elli kuruş");
    expect(moneyToWords(99)).toBe("doksan dokuz kuruş");
  });

  test.each([
    [101, "bir Türk lirası bir kuruş"],
    [1000, "on Türk lirası"],
    [1100, "on bir Türk lirası"],
    [2100, "yirmi bir Türk lirası"],
    [9900, "doksan dokuz Türk lirası"],
    [10000, "yüz Türk lirası"],
    [10100, "yüz bir Türk lirası"],
    [11000, "yüz on Türk lirası"],
    [20000, "iki yüz Türk lirası"],
    [99900, "dokuz yüz doksan dokuz Türk lirası"],
  ])("should spell %d kuruş as %j", (kurus, words) => {
    expect(moneyToWords(kurus)).toBe(words);
  });

  test("should say bin and yüz without a leading bir", () => {
    expect(moneyToWords(100000)).toBe("bin Türk lirası");
    expect(moneyToWords(100100)).toBe("bin bir Türk lirası");
    expect(moneyToWords(110000)).toBe("bin yüz Türk lirası");
    expect(moneyToWords(199900)).toBe("bin dokuz yüz doksan dokuz Türk lirası");
  });

  test("should keep bir before every other thousand and every larger scale", () => {
    expect(moneyToWords(200000)).toBe("iki bin Türk lirası");
    expect(moneyToWords(2100000)).toBe("yirmi bir bin Türk lirası");
    expect(moneyToWords(10100000)).toBe("yüz bir bin Türk lirası");
    expect(moneyToWords(100000000)).toBe("bir milyon Türk lirası");
    expect(moneyToWords(100000000000)).toBe("bir milyar Türk lirası");
    expect(moneyToWords(100000000000000)).toBe("bir trilyon Türk lirası");
  });

  test("should skip a scale whose group is zero", () => {
    expect(moneyToWords(100000100)).toBe("bir milyon bir Türk lirası");
    expect(moneyToWords(100100000)).toBe("bir milyon bin Türk lirası");
    expect(moneyToWords(100000100000)).toBe("bir milyar bin Türk lirası");
    expect(moneyToWords(200000000005)).toBe("iki milyar Türk lirası beş kuruş");
  });

  test("should spell a long amount group by group", () => {
    expect(moneyToWords(123456789012)).toBe(
      "bir milyar iki yüz otuz dört milyon beş yüz altmış yedi bin sekiz yüz doksan Türk lirası on iki kuruş"
    );
    expect(moneyToWords(11111111111)).toBe(
      "yüz on bir milyon yüz on bir bin yüz on bir Türk lirası on bir kuruş"
    );
  });

  test("should spell the largest safe amount", () => {
    expect(moneyToWords(Number.MAX_SAFE_INTEGER)).toBe(
      "doksan trilyon yetmiş bir milyar dokuz yüz doksan iki milyon beş yüz kırk yedi bin dört yüz dokuz Türk lirası doksan bir kuruş"
    );
  });

  test("should start a negative amount with eksi", () => {
    expect(moneyToWords(-349050)).toBe(
      "eksi üç bin dört yüz doksan Türk lirası elli kuruş"
    );
    expect(moneyToWords(-100)).toBe("eksi bir Türk lirası");
    expect(moneyToWords(-50)).toBe("eksi elli kuruş");
    expect(
      moneyToWords(Number.MIN_SAFE_INTEGER).startsWith("eksi doksan trilyon")
    ).toBe(true);
  });

  test("should spell every digit and every ten", () => {
    expect(
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map((lira) => moneyToWords(lira * 100))
    ).toEqual([
      "bir Türk lirası",
      "iki Türk lirası",
      "üç Türk lirası",
      "dört Türk lirası",
      "beş Türk lirası",
      "altı Türk lirası",
      "yedi Türk lirası",
      "sekiz Türk lirası",
      "dokuz Türk lirası",
    ]);
    expect([10, 20, 30, 40, 50, 60, 70, 80, 90].map(moneyToWords)).toEqual([
      "on kuruş",
      "yirmi kuruş",
      "otuz kuruş",
      "kırk kuruş",
      "elli kuruş",
      "altmış kuruş",
      "yetmiş kuruş",
      "seksen kuruş",
      "doksan kuruş",
    ]);
  });

  test("should never leave a double space or a stray edge space", () => {
    for (const kurus of [0, 1, 100, 100000, 100100000, 100000000005, -1]) {
      const words = moneyToWords(kurus);
      expect(words).toBe(words.trim());
      expect(words.includes("  ")).toBe(false);
    }
  });

  test.each(NON_NUMBERS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => moneyToWords(value as number)).toThrow(
        new TypeError(
          `moneyToWords: expected an amount in kuruş as a number, received ${received}`
        )
      );
    }
  );

  test.each(UNSAFE_AMOUNTS)("should throw a RangeError for %d", (value) => {
    expect(() => moneyToWords(value)).toThrow(
      new RangeError(
        `moneyToWords: expected a whole number of kuruş within the safe integer range, received ${value}`
      )
    );
  });
});
