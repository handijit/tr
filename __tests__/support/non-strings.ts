/** Values a caller can pass where a string is expected, with the name the error reports. */
const NON_STRINGS: readonly (readonly [unknown, string])[] = [
  [undefined, "undefined"],
  [null, "null"],
  [0, "number"],
  [Number.NaN, "number"],
  [12n, "bigint"],
  [true, "boolean"],
  [Symbol("text"), "symbol"],
  [{}, "object"],
  [[], "object"],
  [["a"], "object"],
  [new String("text"), "object"],
  [new Date(0), "object"],
  [{ toString: (): string => "text" }, "object"],
  [(): string => "text", "function"],
];

export default NON_STRINGS;
