import { describe, expect, expectTypeOf, test } from "vitest";

import {
  capitalize,
  compareTurkish,
  DAY_NAMES,
  foldText,
  formatDate,
  formatDateTime,
  formatIban,
  formatMoney,
  formatPhone,
  getDayName,
  getMonthName,
  getPhoneType,
  getProvinceByCode,
  getProvinceByName,
  isValidIban,
  isValidLicensePlate,
  isValidPhone,
  isValidTckn,
  isValidVkn,
  moneyToWords,
  MONTH_NAMES,
  normalizeIban,
  normalizePhone,
  parseDate,
  parseMoney,
  PROVINCES,
  slugify,
  toLowerCase,
  toTitleCase,
  toUpperCase,
} from "../lib/index";
import type {
  FormatMoneyOptions,
  FormatPhoneOptions,
  PhoneType,
  Province,
  TimeZoneOptions,
} from "../lib/index";

describe("type surface", () => {
  test("should keep the text helpers string to string", () => {
    for (const helper of [
      toUpperCase,
      toLowerCase,
      capitalize,
      toTitleCase,
      foldText,
      slugify,
    ]) {
      expectTypeOf(helper).toEqualTypeOf<(text: string) => string>();
    }
    expect(slugify("Tip Yüzeyi")).toBe("tip-yuzeyi");
  });

  test("should make compareTurkish a comparator for Array.prototype.sort", () => {
    expectTypeOf(compareTurkish).toEqualTypeOf<
      (left: string, right: string) => number
    >();
    expectTypeOf(["b", "a"].sort(compareTurkish)).toEqualTypeOf<string[]>();
  });

  test("should let the validators take any value and answer with a boolean", () => {
    for (const validator of [
      isValidTckn,
      isValidVkn,
      isValidIban,
      isValidPhone,
      isValidLicensePlate,
    ]) {
      expectTypeOf(validator).toEqualTypeOf<(value: unknown) => boolean>();
    }
    expect(isValidTckn(undefined)).toBe(false);
  });

  test("should return null, not undefined, where input can be invalid", () => {
    expectTypeOf(normalizeIban).toEqualTypeOf<
      (value: string) => string | null
    >();
    expectTypeOf(formatIban).toEqualTypeOf<(value: string) => string | null>();
    expectTypeOf(normalizePhone).toEqualTypeOf<
      (value: string) => string | null
    >();
    expectTypeOf(getPhoneType).toEqualTypeOf<
      (value: string) => PhoneType | null
    >();
    expectTypeOf(formatPhone("05321234567")).toEqualTypeOf<string | null>();
    expectTypeOf(parseMoney).toEqualTypeOf<(text: string) => number | null>();
    expectTypeOf(parseDate).toEqualTypeOf<(text: string) => string | null>();
    expectTypeOf(getProvinceByCode(34)).toEqualTypeOf<Province | null>();
    expectTypeOf(getProvinceByName("Ankara")).toEqualTypeOf<Province | null>();
  });

  test("should narrow the phone type to its three names", () => {
    expectTypeOf<PhoneType>().toEqualTypeOf<
      "mobile" | "landline" | "nonGeographic"
    >();
  });

  test("should take money as a number of kuruş and return text", () => {
    expectTypeOf(formatMoney).parameters.toEqualTypeOf<
      [kurus: number, options?: FormatMoneyOptions]
    >();
    expectTypeOf(formatMoney).returns.toEqualTypeOf<string>();
    expectTypeOf(moneyToWords).toEqualTypeOf<(kurus: number) => string>();
    expectTypeOf<FormatMoneyOptions>().toEqualTypeOf<{ symbol?: boolean }>();
  });

  test("should keep the phone style to its two names", () => {
    expectTypeOf<FormatPhoneOptions>().toEqualTypeOf<{
      style?: "national" | "international";
    }>();
    expectTypeOf(formatPhone).parameters.toEqualTypeOf<
      [value: string, options?: FormatPhoneOptions]
    >();
  });

  test("should take dates as Date, timestamp or calendar date string", () => {
    expectTypeOf(formatDate).parameters.toEqualTypeOf<
      [date: Date | number | string, options?: TimeZoneOptions]
    >();
    expectTypeOf(getMonthName).parameters.toEqualTypeOf<
      [date: Date | number | string, options?: TimeZoneOptions]
    >();
    expectTypeOf(getDayName).parameters.toEqualTypeOf<
      [date: Date | number | string, options?: TimeZoneOptions]
    >();
    expectTypeOf(formatDateTime).parameters.toEqualTypeOf<
      [date: Date | number, options?: TimeZoneOptions]
    >();
    expectTypeOf(formatDateTime).returns.toEqualTypeOf<string>();
    expectTypeOf<TimeZoneOptions>().toEqualTypeOf<{ timeZone?: string }>();
  });

  test("should expose the lists as read-only", () => {
    expectTypeOf(MONTH_NAMES).toEqualTypeOf<readonly string[]>();
    expectTypeOf(DAY_NAMES).toEqualTypeOf<readonly string[]>();
    expectTypeOf(PROVINCES).toEqualTypeOf<readonly Province[]>();
    expectTypeOf<Province>().toEqualTypeOf<{
      readonly code: number;
      readonly name: string;
    }>();
  });

  test("should not compile a write to a list or to a province", () => {
    expect(() => {
      // @ts-expect-error the list is read-only
      PROVINCES.push({ code: 82, name: "Atlantis" });
    }).toThrow(TypeError);
    expect(() => {
      // @ts-expect-error the fields of a province are read-only
      (PROVINCES[0] as Province).name = "Seyhan";
    }).toThrow(TypeError);
    expect(() => {
      // @ts-expect-error the list is read-only
      MONTH_NAMES[0] = "January";
    }).toThrow(TypeError);
  });

  test("should not compile a text helper called with a number", () => {
    // @ts-expect-error text must be a string
    expect(() => toUpperCase(34)).toThrow(TypeError);
    // @ts-expect-error text is required
    expect(() => slugify()).toThrow(TypeError);
  });

  test("should not compile money passed as text or as a bigint", () => {
    // @ts-expect-error kuruş is a number, parseMoney reads text
    expect(() => formatMoney("3.490,00")).toThrow(TypeError);
    // @ts-expect-error kuruş is a number, not a bigint
    expect(() => moneyToWords(349050n)).toThrow(TypeError);
    // @ts-expect-error parseMoney reads text
    expect(() => parseMoney(349050)).toThrow(TypeError);
  });

  test("should not compile an unknown option value", () => {
    // @ts-expect-error style is "national" or "international"
    expect(formatPhone("05321234567", { style: "e164" })).toBe(
      "0 (532) 123 45 67"
    );
    // @ts-expect-error symbol is a boolean
    expect(formatMoney(100, { symbol: "₺" })).toBe("1,00 TL");
    // @ts-expect-error timeZone is an IANA name, not an offset
    expect(() => formatDate(0, { timeZone: 3 })).toThrow(TypeError);
  });

  test("should not compile a date and time read from text", () => {
    // @ts-expect-error formatDateTime needs an instant; a calendar date has no time
    expect(() => formatDateTime("2026-11-10")).toThrow(TypeError);
  });

  test("should not compile a province code that is neither number nor string", () => {
    // @ts-expect-error a plate code is a number or a string
    expect(() => getProvinceByCode(34n)).toThrow(TypeError);
    // @ts-expect-error a name is a string
    expect(() => getProvinceByName(34)).toThrow(TypeError);
  });
});
