import { describe, expect, test } from "vitest";

import assertKurus from "../lib/helpers/assert-kurus.helper";
import { NON_NUMBERS, UNSAFE_AMOUNTS } from "./support/non-numbers";

describe("assertKurus", () => {
  test.each([
    0,
    -0,
    1,
    -1,
    349050,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
  ])("should let the whole amount %d through", (value) => {
    expect(() => assertKurus(value, "source")).not.toThrow();
  });

  test.each(NON_NUMBERS)(
    "should throw a TypeError that names the caller for %o",
    (value, received) => {
      expect(() => assertKurus(value, "caller")).toThrow(
        new TypeError(
          `caller: expected an amount in kuruş as a number, received ${received}`
        )
      );
    }
  );

  test.each(UNSAFE_AMOUNTS)(
    "should throw a RangeError that names the caller for %d",
    (value) => {
      expect(() => assertKurus(value, "caller")).toThrow(
        new RangeError(
          `caller: expected a whole number of kuruş within the safe integer range, received ${value}`
        )
      );
    }
  );
});
