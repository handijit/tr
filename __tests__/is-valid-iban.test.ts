import { describe, expect, test } from "vitest";

import isValidIban from "../lib/modules/is-valid-iban";
import { VALID_IBANS } from "./support/identity-numbers";
import NON_STRING_VALUES from "./support/non-string-values";

// The example IBAN the SWIFT registry prints for Turkey; it belongs to nobody.
const REGISTRY_EXAMPLE = "TR330006100519786457841326";

describe("isValidIban", () => {
  test.each(VALID_IBANS)("should accept the generated IBAN %s", (iban) => {
    expect(isValidIban(iban)).toBe(true);
  });

  test("should accept the registry example", () => {
    expect(isValidIban(REGISTRY_EXAMPLE)).toBe(true);
  });

  test("should accept the printed form and lower-case letters", () => {
    expect(isValidIban("TR33 0006 1005 1978 6457 8413 26")).toBe(true);
    expect(isValidIban("tr33 0006 1005 1978 6457 8413 26")).toBe(true);
    expect(isValidIban("  TR330006100519786457841326\n")).toBe(true);
  });

  test("should reject every single-digit change of a valid IBAN", () => {
    for (let index = 2; index < REGISTRY_EXAMPLE.length; index += 1) {
      for (let digit = 0; digit <= 9; digit += 1) {
        if (String(digit) === REGISTRY_EXAMPLE[index]) continue;
        const changed = `${REGISTRY_EXAMPLE.slice(0, index)}${digit}${REGISTRY_EXAMPLE.slice(index + 1)}`;
        expect(isValidIban(changed), changed).toBe(false);
      }
    }
  });

  test("should reject two neighbouring digits that swapped places", () => {
    expect(isValidIban("TR330006100519786457841362")).toBe(false);
    expect(isValidIban("TR330006100591786457841326")).toBe(false);
  });

  test("should reject an IBAN of another country", () => {
    // Valid German and British examples from the same registry.
    expect(isValidIban("DE89370400440532013000")).toBe(false);
    expect(isValidIban("GB29NWBK60161331926819")).toBe(false);
  });

  test("should reject a wrong length", () => {
    expect(isValidIban("TR33000610051978645784132")).toBe(false);
    expect(isValidIban("TR3300061005197864578413260")).toBe(false);
    expect(isValidIban("TR")).toBe(false);
    expect(isValidIban("")).toBe(false);
  });

  test("should reject letters and punctuation after the country code", () => {
    expect(isValidIban("TR33000610051978645784132A")).toBe(false);
    expect(isValidIban("TR33-0006-1005-1978-6457-8413-26")).toBe(false);
    expect(isValidIban("TR33０006100519786457841326")).toBe(false);
  });

  test("should reject a dotted capital İ in place of the country code letters", () => {
    expect(isValidIban("tı330006100519786457841326")).toBe(false);
  });

  test.each(NON_STRING_VALUES)("should reject the non-string %o", (value) => {
    expect(isValidIban(value)).toBe(false);
  });

  test("should reject an IBAN wrapped in an object", () => {
    expect(isValidIban(new String(REGISTRY_EXAMPLE))).toBe(false);
    expect(isValidIban([REGISTRY_EXAMPLE])).toBe(false);
  });
});
