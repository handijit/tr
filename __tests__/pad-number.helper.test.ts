import { describe, expect, test } from "vitest";

import padNumber from "../lib/helpers/pad-number.helper";

describe("padNumber", () => {
  test("should pad a short number with zeros on the left", () => {
    expect(padNumber(7, 2)).toBe("07");
    expect(padNumber(0, 2)).toBe("00");
    expect(padNumber(987, 4)).toBe("0987");
  });

  test("should leave a number that already fills the width", () => {
    expect(padNumber(10, 2)).toBe("10");
    expect(padNumber(2026, 4)).toBe("2026");
  });

  test("should never cut a number that is wider than the width", () => {
    expect(padNumber(123, 2)).toBe("123");
  });
});
