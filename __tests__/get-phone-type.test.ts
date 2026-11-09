import { describe, expect, test } from "vitest";

import getPhoneType from "../lib/modules/get-phone-type";
import NON_STRINGS from "./support/non-strings";

describe("getPhoneType", () => {
  test.each([
    "0532 123 45 67",
    "+90 505 123 45 67",
    "5551234567",
    "0090 542 123 45 67",
  ])("should call %j a mobile number", (phone) => {
    expect(getPhoneType(phone)).toBe("mobile");
  });

  test.each([
    "0212 123 45 67",
    "0 (312) 123 45 67",
    "+90 232 123 45 67",
    "0462 123 45 67",
    "4881234567",
  ])("should call %j a landline", (phone) => {
    expect(getPhoneType(phone)).toBe("landline");
  });

  test.each(["0850 123 45 67", "0 (800) 123 45 67", "+90 888 123 45 67"])(
    "should call %j a non-geographic number",
    (phone) => {
      expect(getPhoneType(phone)).toBe("nonGeographic");
    }
  );

  test("should return null for text that is not a Turkish phone number", () => {
    expect(getPhoneType("")).toBeNull();
    expect(getPhoneType("444 12 34")).toBeNull();
    expect(getPhoneType("+1 202 555 0100")).toBeNull();
    expect(getPhoneType("0 (712) 123 45 67")).toBeNull();
    expect(getPhoneType("telefon")).toBeNull();
  });

  test.each(NON_STRINGS)(
    "should throw a TypeError for %o",
    (value, received) => {
      expect(() => getPhoneType(value as string)).toThrow(
        new TypeError(`getPhoneType: expected a string, received ${received}`)
      );
    }
  );
});
