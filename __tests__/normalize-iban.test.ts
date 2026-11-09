import { describe, expect, test } from "vitest";

import normalizeIban from "../lib/modules/normalize-iban";
import { VALID_IBANS } from "./support/identity-numbers";
import NON_STRINGS from "./support/non-strings";

describe("normalizeIban", () => {
  test("should remove the spaces of the printed form", () => {
    expect(normalizeIban("TR33 0006 1005 1978 6457 8413 26")).toBe(
      "TR330006100519786457841326"
    );
  });

  test("should upper-case the country code", () => {
    expect(normalizeIban(" tr33 0006 1005 1978 6457 8413 26\t")).toBe(
      "TR330006100519786457841326"
    );
  });

  test.each(VALID_IBANS)("should return %s as it is", (iban) => {
    expect(normalizeIban(iban)).toBe(iban);
  });

  test("should return null for an IBAN that fails the checksum", () => {
    expect(normalizeIban("TR330006100519786457841327")).toBeNull();
  });

  test("should return null for text that is not a Turkish IBAN", () => {
    expect(normalizeIban("")).toBeNull();
    expect(normalizeIban("DE89370400440532013000")).toBeNull();
    expect(normalizeIban("TR33 0006 1005")).toBeNull();
    expect(normalizeIban("iban")).toBeNull();
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => normalizeIban(value as string)).toThrow(
        new TypeError(`normalizeIban: expected a string, received ${received}`)
      );
    }
  );
});
