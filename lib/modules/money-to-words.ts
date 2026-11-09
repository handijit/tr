import assertKurus from "../helpers/assert-kurus.helper";

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
// The largest safe amount is about 90 trilyon lira, so the list never runs out.
const SCALES = ["", "bin", "milyon", "milyar", "trilyon"];

const groupToWords = (group: number): string[] => {
  const hundreds = Math.floor(group / 100);
  const tens = Math.floor((group % 100) / 10);
  const ones = group % 10;

  const words: string[] = [];
  // Turkish says "yüz", never "bir yüz".
  if (hundreds > 1) words.push(ONES[hundreds] as string);
  if (hundreds > 0) words.push("yüz");
  if (tens > 0) words.push(TENS[tens] as string);
  if (ones > 0) words.push(ONES[ones] as string);
  return words;
};

const numberToWords = (value: number): string => {
  if (value === 0) return "sıfır";

  const words: string[] = [];
  let remaining = value;
  for (let scale = 0; remaining > 0; scale += 1) {
    const group = remaining % 1000;
    remaining = (remaining - group) / 1000;
    if (group === 0) continue;

    const groupWords = groupToWords(group);
    // "bin", never "bir bin"; every larger scale keeps its "bir" ("bir milyon").
    if (scale === 1 && group === 1) groupWords.length = 0;
    if (scale > 0) groupWords.push(SCALES[scale] as string);
    words.unshift(...groupWords);
  }
  return words.join(" ");
};

/**
 * Writes an amount held in whole kuruş in Turkish words, the way an invoice spells it:
 * 349050 → "üç bin dört yüz doksan Türk lirası elli kuruş".
 */
const moneyToWords = (kurus: number): string => {
  assertKurus(kurus, "moneyToWords");

  const absolute = Math.abs(kurus);
  const kurusPart = absolute % 100;
  const liraPart = (absolute - kurusPart) / 100;

  const parts: string[] = [];
  if (kurus < 0) parts.push("eksi");
  // An amount below one lira is read by its kuruş alone; zero still needs a unit to stand on.
  if (liraPart > 0 || kurusPart === 0) {
    parts.push(`${numberToWords(liraPart)} Türk lirası`);
  }
  if (kurusPart > 0) parts.push(`${numberToWords(kurusPart)} kuruş`);
  return parts.join(" ");
};

export default moneyToWords;
