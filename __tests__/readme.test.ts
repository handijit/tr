import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import * as api from "../lib/index";

// The README promises that every line it marks with "// →" or "// throws" is what the code
// really gives. This file runs each code block of the README and compares.

type Example = {
  /** The example as it stands in the README. */
  line: string;
  /** What the README says the expression gives or throws. */
  expected: string;
  /** What the expression really gives or throws. */
  actual: string;
};

const README = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const EXPORT_NAMES = Object.keys(api) as (keyof typeof api)[];

const CODE_BLOCK = /```ts\n([\s\S]*?)```/g;
const IMPORT_STATEMENT = /^import [^;]*;$/gm;
const VALUE_LINE = /^(.*); \/\/ → (.*)$/;
const THROWS_LINE = /^(.*); \/\/ throws (.*)$/;

// Writes a value the way the README does: strings in double quotes, lists and objects inline.
const show = (value: unknown): string => {
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(show).join(", ")}]`;
  if (value !== null && typeof value === "object") {
    const fields = Object.entries(value).map(
      ([key, field]) => `${key}: ${show(field)}`
    );
    return `{ ${fields.join(", ")} }`;
  }
  return String(value);
};

const isMarked = (line: string): boolean =>
  VALUE_LINE.test(line) || THROWS_LINE.test(line);

const runBlock = (block: string): Example[] => {
  const examples: Example[] = [];
  const recordValue = (
    line: string,
    expected: string,
    value: unknown
  ): void => {
    examples.push({ line, expected, actual: show(value) });
  };
  const recordThrow = (
    line: string,
    expected: string,
    run: () => unknown
  ): void => {
    let actual = "nothing was thrown";
    try {
      run();
    } catch (error) {
      actual =
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error);
    }
    examples.push({ line, expected, actual });
  };

  const statements = block
    .replace(IMPORT_STATEMENT, "")
    .split("\n")
    .map((line) => {
      const value = VALUE_LINE.exec(line);
      if (value !== null) {
        return `__value(${JSON.stringify(line)}, ${JSON.stringify(value[2])}, (${value[1]}));`;
      }
      const thrown = THROWS_LINE.exec(line);
      if (thrown !== null) {
        return `__throws(${JSON.stringify(line)}, ${JSON.stringify(thrown[2])}, () => (${thrown[1]}));`;
      }
      return line;
    });

  // The blocks are plain JavaScript, so each one runs as written, with the exports of the
  // package in scope in place of its import statement. A block in another dialect, or an
  // example broken over two lines, is a syntax error here and fails the file.
  const run = new Function(
    ...EXPORT_NAMES,
    "__value",
    "__throws",
    statements.join("\n")
  ) as (...scope: unknown[]) => void;
  run(...EXPORT_NAMES.map((name) => api[name]), recordValue, recordThrow);
  return examples;
};

// A block without a marked line shows a signature or a type, not something to run.
const examples = [...README.matchAll(CODE_BLOCK)]
  .map((match) => match[1] as string)
  .filter((block) => block.split("\n").some((line) => isMarked(line)))
  .flatMap(runBlock);

describe("README", () => {
  test.each(examples)("should be right about $line", ({ expected, actual }) => {
    expect(actual).toBe(expected);
  });

  test("should mark no example outside a block that is run", () => {
    const marked = README.split("\n").filter(isMarked);
    expect(marked).toEqual(examples.map(({ line }) => line));
  });

  test.each(EXPORT_NAMES)("should show %s in a checked example", (name) => {
    expect(examples.some(({ line }) => line.includes(name))).toBe(true);
  });

  test.each(EXPORT_NAMES)(
    "should document %s under its own heading",
    (name) => {
      expect(README).toContain(`\n#### \`${name}\`\n`);
      expect(README).toContain(`[\`${name}\`](#${name.toLowerCase()})`);
    }
  );

  test("should count the exports correctly", () => {
    expect(README).toContain(`All ${EXPORT_NAMES.length} exports are named`);
  });
});
