/** Values a validator can be handed that are not strings; none of them is ever valid. */
const NON_STRING_VALUES: readonly unknown[] = [
  undefined,
  null,
  0,
  12345678901,
  Number.NaN,
  12n,
  true,
  Symbol("value"),
  {},
  [],
  new Date(0),
  (): string => "value",
];

export default NON_STRING_VALUES;
