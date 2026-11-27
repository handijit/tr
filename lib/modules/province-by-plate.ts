import type { Province } from "../types";
import PROVINCES from "./provinces";

const PLATE_PATTERN = /^\d{1,2}$/;

/** Reads a plate code given as 34, "34" or "06"; anything else becomes NaN. */
const toPlateNumber = (plate: unknown): number => {
  if (typeof plate === "number") return plate;
  if (typeof plate === "string" && PLATE_PATTERN.test(plate.trim())) {
    return Number(plate.trim());
  }
  return NaN;
};

/** Looks a province up by plate code: provinceByPlate("06") → { plate: 6, name: "Ankara" }. Unknown → undefined. */
const provinceByPlate = (plate: number | string): Province | undefined => {
  const code = toPlateNumber(plate);
  // PROVINCES is ordered by plate, so the code is the index plus one; out of range reads undefined.
  return Number.isInteger(code) ? PROVINCES[code - 1] : undefined;
};

export default provinceByPlate;
