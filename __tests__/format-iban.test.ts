import { describe, expect, test } from "vitest";

import formatIban from "../lib/modules/format-iban";

describe("formatIban", () => {
  test("should group a valid IBAN by four", () => {
    expect(formatIban("tr330006100519786457841326")).toBe(
      "TR33 0006 1005 1978 6457 8413 26"
    );
    expect(formatIban(" TR33 0006 1005 1978 6457 8413 26 ")).toBe(
      "TR33 0006 1005 1978 6457 8413 26"
    );
  });

  test.each(["TR340006100519786457841326", "", 42, null])(
    "should return undefined for %j",
    (value) => {
      expect(formatIban(value)).toBeUndefined();
    }
  );
});
