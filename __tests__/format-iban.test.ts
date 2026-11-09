import { describe, expect, test } from "vitest";

import formatIban from "../lib/modules/format-iban";
import normalizeIban from "../lib/modules/normalize-iban";
import { VALID_IBANS } from "./support/identity-numbers";
import NON_STRINGS from "./support/non-strings";

describe("formatIban", () => {
  test("should print a compact IBAN in groups of four", () => {
    expect(formatIban("TR330006100519786457841326")).toBe(
      "TR33 0006 1005 1978 6457 8413 26"
    );
  });

  test("should tidy an IBAN typed with stray spaces and lower-case letters", () => {
    expect(formatIban(" tr33000610 0519786457 841326 ")).toBe(
      "TR33 0006 1005 1978 6457 8413 26"
    );
  });

  test("should return a printed IBAN unchanged", () => {
    expect(formatIban("TR33 0006 1005 1978 6457 8413 26")).toBe(
      "TR33 0006 1005 1978 6457 8413 26"
    );
  });

  test.each(VALID_IBANS)(
    "should round-trip %s through normalizeIban",
    (iban) => {
      const printed = formatIban(iban) as string;
      expect(printed).toHaveLength(32);
      expect(printed.endsWith(" ")).toBe(false);
      expect(normalizeIban(printed)).toBe(iban);
    }
  );

  test("should return null for an IBAN that fails the checksum", () => {
    expect(formatIban("TR330006100519786457841327")).toBeNull();
  });

  test("should return null for text that is not a Turkish IBAN", () => {
    expect(formatIban("")).toBeNull();
    expect(formatIban("TR33")).toBeNull();
    expect(formatIban("GB29NWBK60161331926819")).toBeNull();
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => formatIban(value as string)).toThrow(
        new TypeError(`formatIban: expected a string, received ${received}`)
      );
    }
  );
});
