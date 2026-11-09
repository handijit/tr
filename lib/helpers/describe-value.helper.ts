/** Names a value for an error message; `typeof null` alone would say "object". */
const describeValue = (value: unknown): string =>
  value === null ? "null" : typeof value;

export default describeValue;
