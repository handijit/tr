import { assertString } from "../helpers/assert.helper";
import { foldDiacritics, lowerTr } from "../helpers/turkish-case.helper";

type SlugifyOptions = {
  /** Longest slug to return; a longer one is cut at the last word boundary that fits. NaN or below 1 means no limit. */
  maxLength?: number;
};

const NON_ALPHANUMERIC_RUN = /[^a-z0-9]+/g;
const EDGE_DASHES = /^-|-$/g;

/** Turns any text into a URL slug: "Ön Fren Balatası" → "on-fren-balatasi". */
const slugify = (text: string, { maxLength }: SlugifyOptions = {}): string => {
  assertString(text, "slugify", "text");
  // Runs collapse to one dash first, so at most one dash can sit at either edge.
  const slug = foldDiacritics(lowerTr(text))
    .replace(NON_ALPHANUMERIC_RUN, "-")
    .replace(EDGE_DASHES, "");

  // NaN, a non-number or anything below 1 means "no limit", like leaving the option out.
  if (!(typeof maxLength === "number" && maxLength >= 1)) return slug;
  if (slug.length <= maxLength) return slug;

  const limit = Math.floor(maxLength);
  // A dash right after the cut means the cut already falls between two words.
  if (slug[limit] === "-") return slug.slice(0, limit);
  const head = slug.slice(0, limit);
  const lastDash = head.lastIndexOf("-");
  // A single word longer than the limit has no boundary to cut at; it is cut hard.
  return lastDash === -1 ? head : head.slice(0, lastDash);
};

export type { SlugifyOptions };
export default slugify;
