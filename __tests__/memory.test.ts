import { beforeEach, describe, expect, test, vi } from "vitest";

// Nine zones: one more than the formatter cache keeps.
const ZONES = [
  "Europe/Istanbul",
  "UTC",
  "America/New_York",
  "Asia/Tokyo",
  "Europe/London",
  "Australia/Sydney",
  "Africa/Cairo",
  "America/Sao_Paulo",
  "Asia/Kolkata",
] as const;
const CACHE_LIMIT = 8;

describe("memory", () => {
  beforeEach(() => {
    // Each test starts from a freshly evaluated package, so its caches start empty.
    vi.resetModules();
  });

  test("should do nothing at import time", async () => {
    vi.useFakeTimers();
    const constructed = vi.spyOn(Intl, "DateTimeFormat");
    const globalsBefore = Object.getOwnPropertyNames(globalThis).sort();

    const api = await import("../lib/index");

    expect(Object.keys(api)).toHaveLength(30);
    expect(constructed).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    expect(Object.getOwnPropertyNames(globalThis).sort()).toEqual(
      globalsBefore
    );
  });

  test("should build one formatter per time zone, not one per call", async () => {
    const { formatDateTime } = await import("../lib/index");
    const constructed = vi.spyOn(Intl, "DateTimeFormat");

    for (let i = 0; i < 10_000; i += 1) {
      formatDateTime(i * 60_000, { timeZone: ZONES[i % CACHE_LIMIT] });
    }

    expect(constructed).toHaveBeenCalledTimes(CACHE_LIMIT);
  });

  test("should share the formatters between the date functions", async () => {
    const { formatDate, formatDateTime, getDayName, getMonthName } =
      await import("../lib/index");
    const constructed = vi.spyOn(Intl, "DateTimeFormat");

    for (let i = 0; i < 1_000; i += 1) {
      formatDate(i);
      formatDateTime(i);
      getDayName(i);
      getMonthName(i);
    }

    expect(constructed).toHaveBeenCalledTimes(1);
  });

  test("should keep at most eight formatters and drop the oldest first", async () => {
    const { formatDateTime } = await import("../lib/index");
    const constructed = vi.spyOn(Intl, "DateTimeFormat");

    // Fill the cache, then ask for a ninth zone: the first one has to go.
    for (const timeZone of ZONES) formatDateTime(0, { timeZone });
    expect(constructed).toHaveBeenCalledTimes(9);

    // The eight newest are still there: no new formatter is built for them.
    for (const timeZone of ZONES.slice(1)) formatDateTime(0, { timeZone });
    expect(constructed).toHaveBeenCalledTimes(9);

    // The evicted one is built again. An unbounded cache would have kept it.
    formatDateTime(0, { timeZone: ZONES[0] });
    expect(constructed).toHaveBeenCalledTimes(10);
  });

  test("should not cache a time zone that does not exist", async () => {
    const { formatDateTime } = await import("../lib/index");
    for (const timeZone of ZONES.slice(0, CACHE_LIMIT)) {
      formatDateTime(0, { timeZone });
    }
    const constructed = vi.spyOn(Intl, "DateTimeFormat");

    for (let i = 0; i < 1_000; i += 1) {
      expect(() => formatDateTime(0, { timeZone: `Nowhere/${i}` })).toThrow(
        RangeError
      );
    }
    // Had the bad names been cached, they would have pushed the good ones out.
    for (const timeZone of ZONES.slice(0, CACHE_LIMIT)) {
      formatDateTime(0, { timeZone });
    }

    expect(constructed).toHaveBeenCalledTimes(1_000);
  });

  test("should keep the province lookup at 81 entries however many names are asked", async () => {
    const { getProvinceByName } = await import("../lib/index");
    const mapWrites = vi.spyOn(Map.prototype, "set");

    for (let i = 0; i < 10_000; i += 1) {
      expect(getProvinceByName(`Bilinmeyen ${i}`)).toBeNull();
    }
    expect(getProvinceByName("İstanbul")?.code).toBe(34);

    const lookups = new Set(
      (mapWrites.mock.contexts as Map<unknown, unknown>[]).filter((map) =>
        map.has("istanbul")
      )
    );
    expect(lookups.size).toBe(1);
    for (const lookup of lookups) expect(lookup.size).toBe(81);
  });

  test("should build the province lookup once", async () => {
    const { getProvinceByName, PROVINCES } = await import("../lib/index");
    // The list is frozen and cannot carry a spy of its own, so its walks are counted
    // through the prototype.
    const walks = vi.spyOn(Array.prototype, "map");

    for (let i = 0; i < 1_000; i += 1) getProvinceByName("Ankara");

    expect(
      walks.mock.contexts.filter((list) => list === PROVINCES)
    ).toHaveLength(1);
  });

  test("should start no timer in any function", async () => {
    vi.useFakeTimers();
    const api = await import("../lib/index");

    api.toUpperCase("i");
    api.toLowerCase("I");
    api.capitalize("i");
    api.toTitleCase("i");
    api.foldText("ı");
    api.slugify("ı");
    api.compareTurkish("a", "b");
    api.isValidTckn("10000000146");
    api.isValidVkn("1234567890");
    api.isValidIban("TR330006100519786457841326");
    api.normalizeIban("TR330006100519786457841326");
    api.formatIban("TR330006100519786457841326");
    api.isValidPhone("05321234567");
    api.getPhoneType("05321234567");
    api.normalizePhone("05321234567");
    api.formatPhone("05321234567");
    api.formatMoney(349050);
    api.parseMoney("3.490,50");
    api.moneyToWords(349050);
    api.formatDate(0);
    api.formatDateTime(0);
    api.parseDate("10.11.2026");
    api.getMonthName(0);
    api.getDayName(0);
    api.getProvinceByCode(34);
    api.getProvinceByName("Ankara");
    api.isValidLicensePlate("34 ABC 123");

    expect(vi.getTimerCount()).toBe(0);
  });
});
