import { describe, expect, test } from "vitest";

import toUpperTr from "../lib/modules/to-upper-tr";

describe("toUpperTr", () => {
  test.each([
    ["izmir", "İZMİR"],
    ["ığdır", "IĞDIR"],
    ["çşğüö abc", "ÇŞĞÜÖ ABC"],
    ["", ""],
  ])("should upper-case %j to %j", (text, expected) => {
    expect(toUpperTr(text)).toBe(expected);
  });

  test("should round-trip with toLowerTr-style input", () => {
    expect(toUpperTr("istanbul ılık")).toBe("İSTANBUL ILIK");
  });

  test("should throw a TypeError for non-string text", () => {
    expect(() => toUpperTr(1n as unknown as string)).toThrow(
      new TypeError("toUpperTr: expected text to be a string, received bigint")
    );
  });
});
