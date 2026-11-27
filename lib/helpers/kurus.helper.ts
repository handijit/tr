import { describeType } from "./assert.helper";

/** 100% expressed in basis points; rates carry at most two decimals (e.g. 0.25%). */
const BASIS = 10_000n;

/** Reads an amount of kuruş as a bigint, so no float ever enters money arithmetic. */
const toKurus = (value: unknown, fnName: string): bigint => {
  if (typeof value === "bigint") return value;
  if (typeof value !== "number") {
    throw new TypeError(
      `${fnName}: expected an integer amount of kuruş (number or bigint), received ${describeType(value)}`
    );
  }
  // A fraction of a kuruş or an unsafe integer has already lost precision; guessing would corrupt money.
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(
      `${fnName}: expected a safe integer amount of kuruş, received ${value}; pass a bigint for larger amounts`
    );
  }
  return BigInt(value);
};

/** Hands the result back in the caller's numeric type; a number result must stay a safe integer. */
const fromKurus = (
  amount: bigint,
  asBigint: boolean,
  fnName: string
): number | bigint => {
  if (asBigint) return amount;
  const result = Number(amount);
  if (!Number.isSafeInteger(result)) {
    throw new RangeError(
      `${fnName}: the result ${amount} exceeds Number.MAX_SAFE_INTEGER; pass the amount as a bigint`
    );
  }
  return result;
};

/** Integer division rounded half away from zero, so a refund mirrors its sale exactly. */
const divRound = (numerator: bigint, divisor: bigint): bigint => {
  const quotient = numerator / divisor;
  const remainder = numerator % divisor;
  const twiceRemainder = (remainder < 0n ? -remainder : remainder) * 2n;
  if (twiceRemainder < divisor) return quotient;
  return numerator < 0n ? quotient - 1n : quotient + 1n;
};

/** Converts a VAT rate in percent (20, 10, 1, 0.5) to integer basis points. */
const toBasisPoints = (ratePercent: unknown, fnName: string): bigint => {
  if (typeof ratePercent !== "number") {
    throw new TypeError(
      `${fnName}: expected ratePercent to be a number, received ${describeType(ratePercent)}`
    );
  }
  const basisPoints = Math.round(ratePercent * 100);
  // The tolerance absorbs binary noise such as 0.07 * 100 = 7.000000000000001.
  if (
    !(ratePercent >= 0) ||
    !Number.isSafeInteger(basisPoints) ||
    Math.abs(ratePercent * 100 - basisPoints) > 1e-6
  ) {
    throw new RangeError(
      `${fnName}: expected a non-negative VAT rate in percent with at most two decimals (like 20 or 0.5), received ${ratePercent}`
    );
  }
  return BigInt(basisPoints);
};

/** VAT owed on a net amount, rounded half away from zero to the kuruş. */
const vatOnNet = (net: bigint, basisPoints: bigint): bigint =>
  divRound(net * basisPoints, BASIS);

/** The net part of a gross (VAT-included) amount, rounded half away from zero to the kuruş. */
const netOfGross = (gross: bigint, basisPoints: bigint): bigint =>
  divRound(gross * BASIS, BASIS + basisPoints);

export { divRound, fromKurus, netOfGross, toBasisPoints, toKurus, vatOnNet };
