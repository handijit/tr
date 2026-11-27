import type { VatCalculator } from "../types";
import {
  fromKurus,
  toBasisPoints,
  toKurus,
  vatOnNet,
} from "../helpers/kurus.helper";

/** Adds VAT to a net amount of kuruş: addVat(10000, 20) → 12000. The VAT is rounded half away from zero. */
const addVat = ((
  kurus: number | bigint,
  ratePercent: number
): number | bigint => {
  const net = toKurus(kurus, "addVat");
  const basisPoints = toBasisPoints(ratePercent, "addVat");
  return fromKurus(
    net + vatOnNet(net, basisPoints),
    typeof kurus === "bigint",
    "addVat"
  );
}) as VatCalculator;

export default addVat;
