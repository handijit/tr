import { describe, expect, test } from "vitest";

import {
  DEFAULT_TIME_ZONE,
  readCalendarDate,
  readInstant,
  toDottedDate,
} from "../lib/helpers/zoned-date.helper";

describe("zoned date helper", () => {
  test("should default to Istanbul", () => {
    expect(DEFAULT_TIME_ZONE).toBe("Europe/Istanbul");
  });

  test("should read the wall clock of an instant in a time zone", () => {
    const instant = new Date("2026-11-10T21:30:00Z");
    expect(readInstant(instant, "Europe/Istanbul", "source")).toEqual({
      year: 2026,
      month: 11,
      day: 11,
      hour: 0,
      minute: 30,
    });
    expect(readInstant(instant.getTime(), "UTC", "source")).toEqual({
      year: 2026,
      month: 11,
      day: 10,
      hour: 21,
      minute: 30,
    });
  });

  test("should read plain numbers out of a first-century date", () => {
    expect(
      readInstant(new Date("0045-03-15T12:00:00Z"), "UTC", "source")
    ).toEqual({
      year: 45,
      month: 3,
      day: 15,
      hour: 12,
      minute: 0,
    });
  });

  test("should take a calendar date string as written", () => {
    expect(
      readCalendarDate("2026-11-10", "Pacific/Kiritimati", "source")
    ).toEqual({
      year: 2026,
      month: 11,
      day: 10,
    });
  });

  test("should not check the time zone for a calendar date string", () => {
    expect(readCalendarDate("2026-11-10", "Nowhere", "source")).toEqual({
      year: 2026,
      month: 11,
      day: 10,
    });
  });

  test("should name the caller in every error", () => {
    expect(() => readInstant({}, "UTC", "caller")).toThrow(
      new TypeError(
        "caller: expected a Date or a timestamp in milliseconds, received object"
      )
    );
    expect(() => readInstant(0, undefined, "caller")).toThrow(
      new TypeError(
        "caller: expected timeZone to be a string, received undefined"
      )
    );
    expect(() => readInstant(0, "Nowhere", "caller")).toThrow(
      new RangeError(
        'caller: unknown time zone "Nowhere", expected an IANA name like "Europe/Istanbul"'
      )
    );
    expect(() => readCalendarDate("2026-02-30", "UTC", "caller")).toThrow(
      new RangeError(
        'caller: expected a real calendar date like "2026-11-10", received "2026-02-30"'
      )
    );
  });

  test("should report the date before the time zone when both are wrong", () => {
    expect(() => readInstant(Number.NaN, 42, "caller")).toThrow(
      new RangeError("caller: received an invalid date")
    );
  });

  test("should write a calendar date with dots and padding", () => {
    expect(toDottedDate({ year: 2026, month: 11, day: 10 })).toBe("10.11.2026");
    expect(toDottedDate({ year: 45, month: 3, day: 5 })).toBe("05.03.0045");
  });
});
