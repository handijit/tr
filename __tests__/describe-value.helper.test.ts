import { describe, expect, test } from "vitest";

import describeValue from "../lib/helpers/describe-value.helper";

describe("describeValue", () => {
  test("should name null as null, not as object", () => {
    expect(describeValue(null)).toBe("null");
  });

  test.each([
    [undefined, "undefined"],
    ["text", "string"],
    [1, "number"],
    [1n, "bigint"],
    [false, "boolean"],
    [Symbol("value"), "symbol"],
    [{}, "object"],
    [[], "object"],
    [(): void => {}, "function"],
  ])("should name %o by its typeof", (value, name) => {
    expect(describeValue(value)).toBe(name);
  });

  test("should not call into the value it describes", () => {
    const hostile = new Proxy(
      {},
      {
        get: (): never => {
          throw new Error("the value was read");
        },
      }
    );
    expect(describeValue(hostile)).toBe("object");
  });
});
