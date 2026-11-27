import type { Kurus } from "../types";
import { toKurus } from "../helpers/kurus.helper";

const ONES = [
  "",
  "bir",
  "iki",
  "üç",
  "dört",
  "beş",
  "altı",
  "yedi",
  "sekiz",
  "dokuz",
];
const TENS = [
  "",
  "on",
  "yirmi",
  "otuz",
  "kırk",
  "elli",
  "altmış",
  "yetmiş",
  "seksen",
  "doksan",
];
const SCALES = [
  "",
  "bin",
  "milyon",
  "milyar",
  "trilyon",
  "katrilyon",
  "kentilyon",
];
// One past the largest amount the scale words above can name (999 kentilyon 999 katrilyon...).
const LIRA_LIMIT = 10n ** 21n;

/** Words for 1–999. Turkish says "yüz", not "bir yüz". */
const hundredsInWords = (group: number): string[] => {
  const hundreds = Math.floor(group / 100);
  const tens = Math.floor(group / 10) % 10;
  const ones = group % 10;
  const words: string[] = [];
  if (hundreds > 1) words.push(ONES[hundreds]!);
  if (hundreds > 0) words.push("yüz");
  if (tens > 0) words.push(TENS[tens]!);
  if (ones > 0) words.push(ONES[ones]!);
  return words;
};

/** Words for a positive whole number. Turkish says "bin", not "bir bin", but "bir milyon". */
const integerInWords = (value: bigint): string[] => {
  const words: string[] = [];
  let rest = value;
  for (let scale = 0; rest > 0n; scale++, rest /= 1000n) {
    const group = Number(rest % 1000n);
    if (group === 0) continue;
    const groupWords = scale === 1 && group === 1 ? [] : hundredsInWords(group);
    if (scale > 0) groupWords.push(SCALES[scale]!);
    words.unshift(...groupWords);
  }
  return words;
};

/** Spells integer kuruş out in Turkish: 123456 → "bin iki yüz otuz dört lira elli altı kuruş". */
const liraInWords = (kurus: Kurus): string => {
  const amount = toKurus(kurus, "liraInWords");
  if (amount === 0n) return "sıfır lira";
  const absolute = amount < 0n ? -amount : amount;
  const lira = absolute / 100n;
  if (lira >= LIRA_LIMIT) {
    throw new RangeError(
      `liraInWords: amounts of ${LIRA_LIMIT} lira or more have no Turkish scale word, received ${amount} kuruş`
    );
  }

  const kurusPart = Number(absolute % 100n);
  const words: string[] = amount < 0n ? ["eksi"] : [];
  if (lira > 0n) words.push(...integerInWords(lira), "lira");
  if (kurusPart > 0) words.push(...hundredsInWords(kurusPart), "kuruş");
  return words.join(" ");
};

export default liraInWords;
