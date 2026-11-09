import { describe, expect, test } from "vitest";

import assertString from "../lib/helpers/assert-string.helper";
import NON_STRINGS from "./support/non-strings";

describe("assertString", () => {
  test("should let every string through, the empty one included", () => {
    expect(() => assertString("", "source")).not.toThrow();
    expect(() => assertString("text", "source")).not.toThrow();
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError that names the caller for %o",
    (value, received) => {
      expect(() => assertString(value, "caller")).toThrow(
        new TypeError(`caller: expected a string, received ${received}`)
      );
    }
  );
});
