import type { VatCalculator } from "../types";
import {
  fromKurus,
  netOfGross,
  toBasisPoints,
  toKurus,
} from "../helpers/kurus.helper";

/** Strips VAT from a gross amount of kuruş: removeVat(12000, 20) → 10000. The net is rounded half away from zero. */
const removeVat = ((
  grossKurus: number | bigint,
  ratePercent: number
): number | bigint => {
  const gross = toKurus(grossKurus, "removeVat");
  const basisPoints = toBasisPoints(ratePercent, "removeVat");
  return fromKurus(
    netOfGross(gross, basisPoints),
    typeof grossKurus === "bigint",
    "removeVat"
  );
}) as VatCalculator;

export default removeVat;
