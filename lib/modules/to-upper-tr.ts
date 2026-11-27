import { assertString } from "../helpers/assert.helper";
import { upperTr } from "../helpers/turkish-case.helper";

/** Upper-cases with Turkish rules ("izmir" → "İZMİR", "ığdır" → "IĞDIR") in any runtime locale. */
const toUpperTr = (text: string): string =>
  upperTr(assertString(text, "toUpperTr", "text"));

export default toUpperTr;
