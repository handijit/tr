import assertString from "../helpers/assert-string.helper";
import foldText from "./fold-text";

const NON_SLUG_CHARACTERS = /[^a-z0-9]+/g;
// After the pass above a slug holds single hyphens only, so at most one sits at each end.
const EDGE_HYPHENS = /^-|-$/g;

/** Builds a URL and file name safe slug: "Şırnak İl Özel İdaresi" → "sirnak-il-ozel-idaresi". */
const slugify = (text: string): string => {
  assertString(text, "slugify");
  return foldText(text)
    .replace(NON_SLUG_CHARACTERS, "-")
    .replace(EDGE_HYPHENS, "");
};

export default slugify;
