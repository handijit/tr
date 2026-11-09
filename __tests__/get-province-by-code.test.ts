import { describe, expect, test } from "vitest";

import getProvinceByCode from "../lib/modules/get-province-by-code";
import PROVINCES from "../lib/modules/provinces";

describe("getProvinceByCode", () => {
  test("should find a province by its numeric code", () => {
    expect(getProvinceByCode(34)).toEqual({ code: 34, name: "İstanbul" });
    expect(getProvinceByCode(1)).toEqual({ code: 1, name: "Adana" });
    expect(getProvinceByCode(81)).toEqual({ code: 81, name: "Düzce" });
  });

  test("should find a province by its code written as text", () => {
    expect(getProvinceByCode("34")).toEqual({ code: 34, name: "İstanbul" });
    expect(getProvinceByCode("06")).toEqual({ code: 6, name: "Ankara" });
    expect(getProvinceByCode("6")).toEqual({ code: 6, name: "Ankara" });
    expect(getProvinceByCode(" 06 ")).toEqual({ code: 6, name: "Ankara" });
  });

  test("should find every province and return the entry of the list itself", () => {
    for (const province of PROVINCES) {
      expect(getProvinceByCode(province.code)).toBe(province);
      expect(getProvinceByCode(String(province.code).padStart(2, "0"))).toBe(
        province
      );
    }
  });

  test.each([0, -0, 82, 100, -1, -34, 1.5, 34.0000001, Number.NaN])(
    "should return null for the number %d",
    (code) => {
      expect(getProvinceByCode(code)).toBeNull();
    }
  );

  test("should return null for an infinite code", () => {
    expect(getProvinceByCode(Number.POSITIVE_INFINITY)).toBeNull();
    expect(getProvinceByCode(Number.NEGATIVE_INFINITY)).toBeNull();
  });

  test.each([
    "0",
    "00",
    "82",
    "99",
    "034",
    "-1",
    "3.4",
    "3,4",
    "1e1",
    "0x22",
    "３４",
    "34 ABC 123",
    "otuz dört",
    "length",
    "__proto__",
    "",
    "  ",
  ])("should return null for the text %j", (code) => {
    expect(getProvinceByCode(code)).toBeNull();
  });

  test.each([
    [undefined, "undefined"],
    [null, "null"],
    [34n, "bigint"],
    [true, "boolean"],
    [Symbol("34"), "symbol"],
    [{}, "object"],
    [[34], "object"],
    [new Number(34), "object"],
    [new String("34"), "object"],
  ])("should throw a TypeError for %o", (code, received) => {
    expect(() => getProvinceByCode(code as number)).toThrow(
      new TypeError(
        `getProvinceByCode: expected a plate code as a number or a string, received ${received}`
      )
    );
  });
});
