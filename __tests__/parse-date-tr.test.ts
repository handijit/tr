import { describe, expect, test } from "vitest";

import formatDateTr from "../lib/modules/format-date-tr";
import parseDateTr from "../lib/modules/parse-date-tr";

describe("parseDateTr", () => {
  test.each([
    ["27.11.2026", "2026-11-27T00:00:00+03:00"],
    ["7.3.2026", "2026-03-07T00:00:00+03:00"],
    ["07/03/2026", "2026-03-07T00:00:00+03:00"],
    [" 27.11.2026 ", "2026-11-27T00:00:00+03:00"],
    ["29.02.2024", "2024-02-29T00:00:00+03:00"],
  ])("should read %j as the start of the day in Türkiye", (text, iso) => {
    expect(parseDateTr(text)?.getTime()).toBe(new Date(iso).getTime());
  });

  test.each([
    "29.02.2026",
    "31.04.2026",
    "15.13.2026",
    "00.01.2026",
    "01.00.2026",
    "27.11.26",
    "27-11-2026",
    "27.11/2026",
    "2026-11-27",
    "",
  ])("should reject %j", (text) => {
    expect(parseDateTr(text)).toBeUndefined();
  });

  test.each([20261127, null, undefined, new Date()])(
    "should return undefined for non-string %j",
    (value) => {
      expect(parseDateTr(value)).toBeUndefined();
    }
  );

  test.each(["01.01.0005", "31.12.9999", "27.11.2026"])(
    "should round-trip %j through formatDateTr",
    (text) => {
      expect(formatDateTr(parseDateTr(text) as Date)).toBe(text);
    }
  );
});
