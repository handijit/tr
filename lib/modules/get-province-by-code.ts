import describeValue from "../helpers/describe-value.helper";
import type { Province } from "../types";
import PROVINCES from "./provinces";

const CODE_PATTERN = /^\d{1,2}$/;

/** Finds a province by its plate code, given as a number (6) or as text ("06"), or returns `null`. */
const getProvinceByCode = (code: number | string): Province | null => {
  if (typeof code === "string") {
    const text = code.trim();
    return CODE_PATTERN.test(text)
      ? (PROVINCES[Number(text) - 1] ?? null)
      : null;
  }
  if (typeof code !== "number") {
    throw new TypeError(
      `getProvinceByCode: expected a plate code as a number or a string, received ${describeValue(code)}`
    );
  }
  // A fraction, NaN or a code outside 1 to 81 names no index of the list.
  return PROVINCES[code - 1] ?? null;
};

export default getProvinceByCode;
