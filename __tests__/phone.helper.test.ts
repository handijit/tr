import { describe, expect, test } from "vitest";

import parsePhone from "../lib/helpers/phone.helper";

describe("parsePhone", () => {
  test("should read the national number out of every spelling", () => {
    for (const phone of [
      "05321234567",
      "5321234567",
      "+90 532 123 45 67",
      "0090 532 123 45 67",
      "90 (532) 123-45-67",
    ]) {
      expect(parsePhone(phone)).toEqual({
        national: "5321234567",
        type: "mobile",
      });
    }
  });

  test("should tell the line type from the first digit", () => {
    expect(parsePhone("2121234567")?.type).toBe("landline");
    expect(parsePhone("3121234567")?.type).toBe("landline");
    expect(parsePhone("4621234567")?.type).toBe("landline");
    expect(parsePhone("5321234567")?.type).toBe("mobile");
    expect(parsePhone("8501234567")?.type).toBe("nonGeographic");
  });

  test("should require the country code after a plus sign", () => {
    expect(parsePhone("+5321234567")).toBeNull();
    expect(parsePhone("+05321234567")).toBeNull();
    expect(parsePhone("+00905321234567")).toBeNull();
  });

  test("should return null for characters a phone number does not have", () => {
    expect(parsePhone("0532 123 45 67 ext 5")).toBeNull();
    expect(parsePhone("0532_123_45_67")).toBeNull();
    expect(parsePhone("")).toBeNull();
  });

  test("should return null for a first digit no Turkish number has", () => {
    for (const digit of ["0", "1", "6", "7", "9"]) {
      expect(parsePhone(`${digit}121234567`)).toBeNull();
    }
  });
});
