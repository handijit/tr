import { describe, expect, test } from "vitest";

import slugify from "../lib/modules/slugify";

describe("slugify", () => {
  test.each([
    ["Ön Fren Balatası", "on-fren-balatasi"],
    ["ÇĞIİÖŞÜ çğıiöşü", "cgiiosu-cgiiosu"],
    ["Kâğıt Îmar Ûmit", "kagit-imar-umit"],
    ["  --Hello,   World!!  ", "hello-world"],
    ["Café Ñandú", "cafe-nandu"],
    ["İstanbul 34", "istanbul-34"],
    ["A4 kağıt (500 adet)", "a4-kagit-500-adet"],
    ["", ""],
    ["!!! ---", ""],
  ])("should slugify %j as %j", (text, expected) => {
    expect(slugify(text)).toBe(expected);
  });

  test("should cut at the last word boundary that fits maxLength", () => {
    expect(slugify("Ön Fren Balatası", { maxLength: 10 })).toBe("on-fren");
    expect(slugify("Ön Fren Balatası", { maxLength: 12 })).toBe("on-fren");
  });

  test("should keep the whole word when the cut lands exactly before a dash", () => {
    expect(slugify("Ön Fren Balatası", { maxLength: 7 })).toBe("on-fren");
    expect(slugify("Ön Fren Balatası", { maxLength: 2 })).toBe("on");
  });

  test("should drop a word cut right after its dash", () => {
    expect(slugify("Ön Fren Balatası", { maxLength: 8 })).toBe("on-fren");
  });

  test("should cut a single word longer than maxLength hard", () => {
    expect(slugify("Balatası", { maxLength: 4 })).toBe("bala");
  });

  test("should floor a fractional maxLength", () => {
    expect(slugify("Ön Fren Balatası", { maxLength: 10.9 })).toBe("on-fren");
  });

  test("should return a slug that already fits unchanged", () => {
    expect(slugify("Ön Fren", { maxLength: 7 })).toBe("on-fren");
    expect(slugify("Ön Fren", { maxLength: Infinity })).toBe("on-fren");
  });

  test.each([0, -5, NaN, 0.5, "10" as unknown as number, undefined])(
    "should treat maxLength %j as no limit",
    (maxLength) => {
      expect(slugify("Ön Fren Balatası", { maxLength })).toBe(
        "on-fren-balatasi"
      );
    }
  );

  test("should throw a TypeError for non-string text", () => {
    expect(() => slugify(42 as unknown as string)).toThrow(
      new TypeError("slugify: expected text to be a string, received number")
    );
    expect(() => slugify(null as unknown as string)).toThrow("received null");
  });
});
