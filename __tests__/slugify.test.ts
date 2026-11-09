import { describe, expect, test } from "vitest";

import slugify from "../lib/modules/slugify";
import NON_STRINGS from "./support/non-strings";

describe("slugify", () => {
  test("should write Turkish letters as ASCII and join words with hyphens", () => {
    expect(slugify("Çığ Düşen Şehir")).toBe("cig-dusen-sehir");
    expect(slugify("Iğdır & İzmir")).toBe("igdir-izmir");
  });

  test("should keep digits", () => {
    expect(slugify("2026 Yılı 3. Çeyrek")).toBe("2026-yili-3-ceyrek");
  });

  test("should collapse a run of separators into one hyphen", () => {
    expect(slugify("stok  --  takip___programı")).toBe("stok-takip-programi");
    expect(slugify("İstanbul'da 3 gün")).toBe("istanbul-da-3-gun");
  });

  test("should not start or end with a hyphen", () => {
    expect(slugify("  ön muhasebe!  ")).toBe("on-muhasebe");
    expect(slugify("(cari)")).toBe("cari");
  });

  test("should return an empty text when nothing can be kept", () => {
    expect(slugify("")).toBe("");
    expect(slugify("---")).toBe("");
    expect(slugify("!?")).toBe("");
    expect(slugify("Привет")).toBe("");
  });

  test("should drop accents from other Latin letters", () => {
    expect(slugify("Café Crème")).toBe("cafe-creme");
  });

  test("should return an existing slug unchanged", () => {
    expect(slugify("on-muhasebe-2026")).toBe("on-muhasebe-2026");
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => slugify(value as string)).toThrow(
        new TypeError(`slugify: expected a string, received ${received}`)
      );
    }
  );
});
