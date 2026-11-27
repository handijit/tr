import { assertString } from "../helpers/assert.helper";
import { lowerTr } from "../helpers/turkish-case.helper";

/** Lower-cases with Turkish rules ("IĞDIR" → "ığdır", "İZMİR" → "izmir") in any runtime locale. */
const toLowerTr = (text: string): string =>
  lowerTr(assertString(text, "toLowerTr", "text"));

export default toLowerTr;
