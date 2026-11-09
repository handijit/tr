import assertKurus from "../helpers/assert-kurus.helper";
import padNumber from "../helpers/pad-number.helper";

type FormatMoneyOptions = {
  /** Write the lira sign before the amount ("₺3.490,00") instead of "TL" after it. Defaults to `false`. */
  symbol?: boolean;
};

const GROUP_SIZE = 3;

const groupThousands = (digits: string): string => {
  let grouped = "";
  for (let end = digits.length; end > 0; end -= GROUP_SIZE) {
    const group = digits.slice(Math.max(0, end - GROUP_SIZE), end);
    grouped = grouped === "" ? group : `${group}.${grouped}`;
  }
  return grouped;
};

/** Writes an amount held in whole kuruş as Turkish lira: 349000 → "3.490,00 TL". */
const formatMoney = (
  kurus: number,
  { symbol = false }: FormatMoneyOptions = {}
): string => {
  assertKurus(kurus, "formatMoney");

  const absolute = Math.abs(kurus);
  // Remainder first, then an exact subtraction: dividing a large amount by 100 directly
  // rounds, and a rounded lira part would print a different number.
  const kurusPart = absolute % 100;
  const liraPart = (absolute - kurusPart) / 100;
  const amount = `${groupThousands(String(liraPart))},${padNumber(kurusPart, 2)}`;
  // `kurus < 0` is false for -0, so a zero never carries a sign.
  const sign = kurus < 0 ? "-" : "";
  return symbol === true ? `${sign}₺${amount}` : `${sign}${amount} TL`;
};

export type { FormatMoneyOptions };
export default formatMoney;
