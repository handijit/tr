import { describe, expect, test } from "vitest";

import capitalize from "../lib/modules/capitalize";
import NON_STRINGS from "./support/non-strings";

describe("capitalize", () => {
  test("should upper-case the first letter by the Turkish rules", () => {
    expect(capitalize("istanbul")).toBe("İstanbul");
    expect(capitalize("ırmak")).toBe("Irmak");
    expect(capitalize("çay")).toBe("Çay");
    expect(capitalize("ankara")).toBe("Ankara");
  });

  test("should leave the rest of the text as it is", () => {
    expect(capitalize("iPhone kılıfı")).toBe("İPhone kılıfı");
    expect(capitalize("eFATURA ve e-arşiv")).toBe("EFATURA ve e-arşiv");
  });

  test("should return a text that already starts with a capital unchanged", () => {
    expect(capitalize("İzmir")).toBe("İzmir");
    expect(capitalize("3 adet")).toBe("3 adet");
    expect(capitalize(" boşlukla başlar")).toBe(" boşlukla başlar");
  });

  test("should return an empty text for an empty text", () => {
    expect(capitalize("")).toBe("");
  });

  test("should treat a character outside the basic plane as one letter", () => {
    expect(capitalize("\u{10428}a")).toBe("\u{10400}a");
  });

  test("should keep a first letter that grows when upper-cased", () => {
    expect(capitalize("ßa")).toBe("SSa");
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => capitalize(value as string)).toThrow(
        new TypeError(`capitalize: expected a string, received ${received}`)
      );
    }
  );
});
