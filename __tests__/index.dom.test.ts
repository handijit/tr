// The published sources compile without the DOM library (tsconfig.json); only this
// browser-side test needs `window` and `document`.
/// <reference lib="dom" />
import { describe, expect, test } from "vitest";

import * as api from "../lib/index";

describe("public entry point in a browser", () => {
  test("should run where a window exists", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });

  test("should add nothing to the window", () => {
    const leaked = Object.getOwnPropertyNames(window).filter((name) =>
      /handijit|turkish|province/i.test(name)
    );
    expect(leaked).toEqual([]);
  });

  test("should give the same text as on the server", () => {
    expect(api.toUpperCase("istanbul")).toBe("İSTANBUL");
    expect(api.toLowerCase("IŞIK")).toBe("ışık");
    expect(api.slugify("Çığ Düşen Şehir")).toBe("cig-dusen-sehir");
    expect(api.formatMoney(349050)).toBe("3.490,50 TL");
    expect(api.moneyToWords(349050)).toBe(
      "üç bin dört yüz doksan Türk lirası elli kuruş"
    );
    expect(api.formatDateTime(new Date("2026-11-10T11:30:00Z"))).toBe(
      "10.11.2026 14:30"
    );
    expect(api.getDayName("2026-11-10")).toBe("Salı");
  });

  test("should validate what a form field holds", () => {
    const input = document.createElement("input");
    input.value = " 0 (532) 123 45 67 ";
    expect(api.isValidPhone(input.value)).toBe(true);
    expect(api.normalizePhone(input.value)).toBe("+905321234567");

    input.value = "TR33 0006 1005 1978 6457 8413 26";
    expect(api.isValidIban(input.value)).toBe(true);
    expect(api.isValidTckn(input.valueAsNumber)).toBe(false);
  });

  test("should fill a select with the provinces in Turkish order", () => {
    const select = document.createElement("select");
    const names = api.PROVINCES.map((province) => province.name).sort(
      api.compareTurkish
    );
    for (const name of names) {
      const option = document.createElement("option");
      option.textContent = name;
      select.append(option);
    }
    expect(select.options).toHaveLength(81);
    expect(select.options[0]?.textContent).toBe("Adana");
    expect(select.options[80]?.textContent).toBe("Zonguldak");
    expect(names.indexOf("Çorum")).toBeLessThan(names.indexOf("Denizli"));
    expect(names.indexOf("Iğdır")).toBeLessThan(names.indexOf("İstanbul"));
  });
});
