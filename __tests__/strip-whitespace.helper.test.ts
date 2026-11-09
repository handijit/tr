import { describe, expect, test } from "vitest";

import stripWhitespace from "../lib/helpers/strip-whitespace.helper";

describe("stripWhitespace", () => {
  test("should remove spaces at the edges and inside", () => {
    expect(stripWhitespace("  TR33 0006 1005  ")).toBe("TR3300061005");
  });

  test("should remove tabs, line breaks and no-break spaces", () => {
    expect(stripWhitespace("1\t2\n3\r4 5 6 7")).toBe("1234567");
  });

  test("should return a text without spaces unchanged", () => {
    expect(stripWhitespace("10000000146")).toBe("10000000146");
    expect(stripWhitespace("")).toBe("");
  });

  test("should keep every other character", () => {
    expect(stripWhitespace("a-b_c.d")).toBe("a-b_c.d");
  });
});
