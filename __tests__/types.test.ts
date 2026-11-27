import { describe, expect, expectTypeOf, test } from "vitest";

import type {
  FormatLiraOptions,
  Kurus,
  Province,
  SlugifyOptions,
  VatOfOptions,
} from "../lib/index";
import {
  addVat,
  compareTr,
  formatLira,
  isTckn,
  normalizePhone,
  parseDateTr,
  parseLira,
  provinceByPlate,
  PROVINCES,
  removeVat,
  slugify,
  vatOf,
} from "../lib/index";

describe("type surface", () => {
  test("VAT helpers should return the numeric type they were given", () => {
    expectTypeOf(addVat(100, 20)).toEqualTypeOf<number>();
    expectTypeOf(addVat(100n, 20)).toEqualTypeOf<bigint>();
    expectTypeOf(removeVat(120n, 20)).toEqualTypeOf<bigint>();
    expectTypeOf(vatOf(120, 20, { from: "gross" })).toEqualTypeOf<number>();
    expectTypeOf(vatOf(120n, 20)).toEqualTypeOf<bigint>();
  });

  test("parsers should admit failure in their return type", () => {
    expectTypeOf(parseLira).parameter(0).toEqualTypeOf<unknown>();
    expectTypeOf(parseLira("1")).toEqualTypeOf<number | undefined>();
    expectTypeOf(normalizePhone("1")).toEqualTypeOf<string | undefined>();
    expectTypeOf(parseDateTr("1")).toEqualTypeOf<Date | undefined>();
    expectTypeOf(provinceByPlate(34)).toEqualTypeOf<Province | undefined>();
  });

  test("validators should return a plain boolean, not a type predicate", () => {
    // A predicate would wrongly narrow an invalid string to `never` in the false branch.
    expectTypeOf(isTckn).returns.toEqualTypeOf<boolean>();
  });

  test("exported option and data types should keep their shape", () => {
    expectTypeOf<Kurus>().toEqualTypeOf<number | bigint>();
    expectTypeOf<Province>().toEqualTypeOf<{
      readonly plate: number;
      readonly name: string;
    }>();
    expectTypeOf<SlugifyOptions>().toEqualTypeOf<{ maxLength?: number }>();
    expectTypeOf<FormatLiraOptions>().toEqualTypeOf<{
      symbol?: boolean;
      fraction?: boolean;
    }>();
    expectTypeOf<VatOfOptions>().toEqualTypeOf<{ from?: "net" | "gross" }>();
    expectTypeOf(PROVINCES).toEqualTypeOf<readonly Province[]>();
    expectTypeOf(formatLira).parameter(0).toEqualTypeOf<Kurus>();
    expectTypeOf(compareTr).toEqualTypeOf<(a: string, b: string) => number>();
  });

  test("text helpers should refuse non-string input", () => {
    // @ts-expect-error text must be a string
    expect(() => slugify(42)).toThrow(TypeError);
  });

  test("vatOf should refuse an unknown base", () => {
    // @ts-expect-error from is "net" or "gross"
    expect(vatOf(100, 20, { from: "tax" })).toBe(20);
  });

  test("PROVINCES should be read-only", () => {
    expect(() => {
      // @ts-expect-error entries are readonly
      PROVINCES[0]!.name = "Seyhan";
    }).toThrow(TypeError);
  });
});
