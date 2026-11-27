import {
  fromKurus,
  netOfGross,
  toBasisPoints,
  toKurus,
  vatOnNet,
} from "../helpers/kurus.helper";

type VatOfOptions = {
  /** `"net"` (default): VAT on top of the amount. `"gross"`: the VAT already inside the amount. */
  from?: "net" | "gross";
};

/** Returns a number for a number amount and a bigint for a bigint amount. */
type VatOf = {
  (kurus: number, ratePercent: number, options?: VatOfOptions): number;
  (kurus: bigint, ratePercent: number, options?: VatOfOptions): bigint;
};

/** The VAT part of an amount of kuruş: vatOf(10000, 20) → 2000; vatOf(12000, 20, { from: "gross" }) → 2000. */
const vatOf = ((
  kurus: number | bigint,
  ratePercent: number,
  { from }: VatOfOptions = {}
): number | bigint => {
  const amount = toKurus(kurus, "vatOf");
  const basisPoints = toBasisPoints(ratePercent, "vatOf");
  // From a gross amount the VAT is what remains after the rounded net, so net + VAT = gross exactly.
  const vat =
    from === "gross"
      ? amount - netOfGross(amount, basisPoints)
      : vatOnNet(amount, basisPoints);
  return fromKurus(vat, typeof kurus === "bigint", "vatOf");
}) as VatOf;

export type { VatOfOptions };
export default vatOf;
