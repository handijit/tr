import { describe, expect, test } from "vitest";

import isTckn from "../lib/modules/is-tckn";

describe("isTckn", () => {
  test.each(["10000000146", "12345678950", "98765432150", "19191919190"])(
    "should accept %j",
    (value) => {
      expect(isTckn(value)).toBe(true);
    }
  );

  test.each([
    ["10000000156", "wrong tenth digit"],
    ["10000000145", "wrong eleventh digit"],
    ["01234567890", "leading zero"],
    ["1000000014", "ten digits"],
    ["100000001460", "twelve digits"],
    ["1000000014a", "a letter"],
    [" 10000000146", "surrounding space"],
    ["", "empty"],
  ])("should reject %j (%s)", (value) => {
    expect(isTckn(value)).toBe(false);
  });

  test.each([10000000146, null, undefined, {}, ["10000000146"]])(
    "should return false for non-string %j",
    (value) => {
      expect(isTckn(value)).toBe(false);
    }
  );
});
