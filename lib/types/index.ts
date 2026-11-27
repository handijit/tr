/** One of the 81 provinces of Türkiye. */
type Province = {
  /** Licence plate code, 1–81. */
  readonly plate: number;
  /** Official name in Turkish, e.g. "İstanbul". */
  readonly name: string;
};

/** An integer amount of kuruş (1 lira = 100 kuruş). A bigint lifts the Number.MAX_SAFE_INTEGER cap. */
type Kurus = number | bigint;

/** Returns a number for a number amount and a bigint for a bigint amount. */
type VatCalculator = {
  (kurus: number, ratePercent: number): number;
  (kurus: bigint, ratePercent: number): bigint;
};

export type { Kurus, Province, VatCalculator };
