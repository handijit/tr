import { describe, expect, test } from "vitest";

import isIban from "../lib/modules/is-iban";

describe("isIban", () => {
  test.each([
    "TR330006100519786457841326",
    "TR33 0006 1005 1978 6457 8413 26",
    "tr33 0006 1005 1978 6457 8413 26",
    " TR33\t0006100519786457841326 ",
  ])("should accept %j", (value) => {
    expect(isIban(value)).toBe(true);
  });

  test.each([
    ["TR340006100519786457841326", "wrong check digits"],
    ["TR330006100519786457841327", "wrong account digit"],
    ["DE89370400440532013000", "valid but not Turkish"],
    ["TR33000610051978645784132", "25 characters"],
    ["TR3300061005197864578413260", "27 characters"],
    ["TR33000610051978645784132X", "a letter in the account"],
    ["", "empty"],
  ])("should reject %j (%s)", (value) => {
    expect(isIban(value)).toBe(false);
  });

  test.each([1234, null, undefined])(
    "should return false for non-string %j",
    (value) => {
      expect(isIban(value)).toBe(false);
    }
  );
});
