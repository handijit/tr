const WHITESPACE = /\s+/g;

/** Drops every whitespace character, including the no-break spaces of pasted text. */
const stripWhitespace = (value: string): string =>
  value.replace(WHITESPACE, "");

export default stripWhitespace;
