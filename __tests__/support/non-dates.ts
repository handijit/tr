/** Values that are neither a Date nor a timestamp, with the name the error reports. */
const NON_DATES: readonly (readonly [unknown, string])[] = [
  [undefined, "undefined"],
  [null, "null"],
  [true, "boolean"],
  [1731231000000n, "bigint"],
  [Symbol("date"), "symbol"],
  [{}, "object"],
  [[2026, 11, 10], "object"],
  [{ getTime: (): number => 0 }, "object"],
  [Object.create(Date.prototype), "object"],
  [(): number => 0, "function"],
];

export default NON_DATES;
