import { describe, expect, test } from "vitest";

import parseIban from "../lib/helpers/iban.helper";
import { makeIban, VALID_IBANS } from "./support/identity-numbers";

describe("parseIban", () => {
  test.each(VALID_IBANS)("should return the compact form of %s", (iban) => {
    expect(parseIban(iban)).toBe(iban);
    expect(parseIban(iban.toLowerCase())).toBe(iban);
    expect(parseIban(` ${iban.slice(0, 4)} ${iban.slice(4)} `)).toBe(iban);
  });

  test("should accept the lowest and the highest check digits", () => {
    // Walk account numbers until both ends of the 02 to 98 range have been seen.
    const seen = new Set<string>();
    for (let account = 0; account < 2_000 && seen.size < 97; account += 1) {
      const iban = makeIban(String(account).padStart(22, "0"));
      seen.add(iban.slice(2, 4));
      expect(parseIban(iban)).toBe(iban);
    }
    expect(seen.has("02")).toBe(true);
    expect(seen.has("98")).toBe(true);
  });

  test("should return null when the checksum does not hold", () => {
    for (const iban of VALID_IBANS) {
      const lastDigit = Number(iban.at(-1));
      expect(
        parseIban(`${iban.slice(0, -1)}${(lastDigit + 1) % 10}`)
      ).toBeNull();
    }
  });

  test("should return null for another country or another shape", () => {
    expect(parseIban("DE89370400440532013000")).toBeNull();
    expect(parseIban("TR")).toBeNull();
    expect(parseIban("")).toBeNull();
    expect(parseIban("TR33 0006 1005 1978 6457 8413 2X")).toBeNull();
  });
});
