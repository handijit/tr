import { assertString } from "../helpers/assert.helper";

// Created on first use rather than at import time; building a collator is not free.
let collator: Intl.Collator | undefined;

/** Compares two strings in Turkish alphabetical order (c < ç < d, ı < i); pass it to `sort`. */
const compareTr = (a: string, b: string): number => {
  assertString(a, "compareTr", "a");
  assertString(b, "compareTr", "b");
  collator ??= new Intl.Collator("tr");
  return collator.compare(a, b);
};

export default compareTr;
