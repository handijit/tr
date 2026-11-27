import { describe, expect, test } from "vitest";

import toLowerTr from "../lib/modules/to-lower-tr";

describe("toLowerTr", () => {
  test.each([
    ["IĞDIR", "ığdır"],
    ["İZMİR", "izmir"],
    ["İZMİR", "izmir"],
    ["ÇŞĞÜÖ ABC", "çşğüö abc"],
    ["", ""],
  ])("should lower-case %j to %j", (text, expected) => {
    expect(toLowerTr(text)).toBe(expected);
  });

  test("should throw a TypeError for non-string text", () => {
    expect(() => toLowerTr({} as unknown as string)).toThrow(
      new TypeError("toLowerTr: expected text to be a string, received object")
    );
  });
});
