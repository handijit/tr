import describeValue from "./describe-value.helper";

type AssertKurus = (value: unknown, source: string) => asserts value is number;

/** Throws unless the amount is a whole number of kuruş that a double holds exactly. */
const assertKurus: AssertKurus = (value, source) => {
  if (typeof value !== "number") {
    throw new TypeError(
      `${source}: expected an amount in kuruş as a number, received ${describeValue(value)}`
    );
  }
  // A fraction or an unsafe integer has already lost kuruş; printing it would invent an amount.
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(
      `${source}: expected a whole number of kuruş within the safe integer range, received ${value}`
    );
  }
};

export default assertKurus;
