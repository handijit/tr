/** Names a value's type for an error message; `typeof null` alone would say "object". */
const describeType = (value: unknown): string =>
  value === null ? "null" : typeof value;

/** Throws a TypeError naming the caller when a required text argument is not a string. */
const assertString = (
  value: unknown,
  fnName: string,
  param: string
): string => {
  if (typeof value !== "string") {
    throw new TypeError(
      `${fnName}: expected ${param} to be a string, received ${describeType(value)}`
    );
  }
  return value;
};

export { assertString, describeType };
