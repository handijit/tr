import describeValue from "./describe-value.helper";

type AssertString = (value: unknown, source: string) => asserts value is string;

/** Throws when a required text argument is not a primitive string. */
const assertString: AssertString = (value, source) => {
  if (typeof value !== "string") {
    throw new TypeError(
      `${source}: expected a string, received ${describeValue(value)}`
    );
  }
};

export default assertString;
