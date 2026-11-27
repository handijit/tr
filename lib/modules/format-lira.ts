import type { Kurus } from "../types";
import { divRound, toKurus } from "../helpers/kurus.helper";

type FormatLiraOptions = {
  /** Prefix the lira sign "₺". Default `true`; only `false` turns it off. */
  symbol?: boolean;
  /** Show the two kuruş digits. Default `true`; `false` rounds half away from zero to whole lira. */
  fraction?: boolean;
};

/** Inserts a dot every three digits from the right: "1234567" → "1.234.567". */
const groupThousands = (digits: string): string => {
  const headLength = digits.length % 3 === 0 ? 3 : digits.length % 3;
  let grouped = digits.slice(0, headLength);
  for (let i = headLength; i < digits.length; i += 3) {
    grouped += `.${digits.slice(i, i + 3)}`;
  }
  return grouped;
};

/** Formats integer kuruş as Turkish lira: 123456 → "₺1.234,56", -5 → "-₺0,05". */
const formatLira = (
  kurus: Kurus,
  { symbol, fraction }: FormatLiraOptions = {}
): string => {
  const exact = toKurus(kurus, "formatLira");
  const showFraction = fraction !== false;
  // Rounded first, so -49 kuruş shown without kuruş reads "₺0" and not "-₺0".
  const amount = showFraction ? exact : divRound(exact, 100n);
  const isNegative = amount < 0n;
  const absolute = isNegative ? -amount : amount;

  const body = showFraction
    ? `${groupThousands((absolute / 100n).toString())},${(absolute % 100n).toString().padStart(2, "0")}`
    : groupThousands(absolute.toString());
  return `${isNegative ? "-" : ""}${symbol === false ? "" : "₺"}${body}`;
};

export type { FormatLiraOptions };
export default formatLira;
