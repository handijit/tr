import assertString from "../helpers/assert-string.helper";
import stripWhitespace from "../helpers/strip-whitespace.helper";

// sign, currency, sign, lira (grouped by dots or plain), kuruş after a comma, currency.
// The lira part takes dots only as complete thousands groups: "1.250" is 1250 lira, while
// "1250.50" is not read at all, because guessing what that dot means would invent money.
const MONEY_PATTERN =
  /^([+\-−]?)(₺|[Tt][Ll]|[Tt][Rr][Yy])?([+\-−]?)([1-9]\d{0,2}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?(₺|[Tt][Ll]|[Tt][Rr][Yy])?$/;
const DOTS = /\./g;

/** Reads a Turkish-formatted amount into whole kuruş: "3.490,50" → 349050, or `null`. */
const parseMoney = (text: string): number | null => {
  assertString(text, "parseMoney");

  const match = MONEY_PATTERN.exec(stripWhitespace(text));
  if (match === null) return null;

  // The two sign groups always take part in a match, as an empty string when no sign is written.
  const outerSign = match[1] as string;
  const innerSign = match[3] as string;
  const lira = match[4] as string;
  const kurus = match[5] ?? "";
  if (outerSign !== "" && innerSign !== "") return null;
  if (match[2] !== undefined && match[6] !== undefined) return null;

  // Digits are joined as text and converted once, so no float arithmetic touches the amount.
  const amount = Number(lira.replace(DOTS, "") + kurus.padEnd(2, "0"));
  if (!Number.isSafeInteger(amount)) return null;

  const sign = outerSign + innerSign;
  // A negative zero would print as "-0" in some places and equal 0 in others.
  return sign !== "" && sign !== "+" && amount !== 0 ? -amount : amount;
};

export default parseMoney;
