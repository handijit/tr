/** Values a caller can pass where a number is expected, with the name the error reports. */
const NON_NUMBERS: readonly (readonly [unknown, string])[] = [
  [undefined, "undefined"],
  [null, "null"],
  ["100", "string"],
  ["", "string"],
  [100n, "bigint"],
  [true, "boolean"],
  [Symbol("amount"), "symbol"],
  [{}, "object"],
  [[100], "object"],
  [new Number(100), "object"],
  [new Date(0), "object"],
  [{ valueOf: (): number => 100 }, "object"],
  [(): number => 100, "function"],
];

/** Numbers that are not a whole, exactly representable count of kuruş. */
const UNSAFE_AMOUNTS: readonly number[] = [
  Number.NaN,
  Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY,
  0.5,
  1999.99,
  -0.01,
  Number.MAX_SAFE_INTEGER + 1,
  Number.MIN_SAFE_INTEGER - 1,
  Number.MAX_VALUE,
  Number.MIN_VALUE,
];

export { NON_NUMBERS, UNSAFE_AMOUNTS };
