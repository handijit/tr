import { existsSync } from "node:fs";
import { cpus } from "node:os";
import { performance } from "node:perf_hooks";

// The published artefact is what consumers run, so that is what gets measured, not the source.
const BUILD_URL = new URL("../build/index.mjs", import.meta.url);
if (!existsSync(BUILD_URL)) {
  console.error('bench: build/index.mjs is missing; run "npm run build" first');
  process.exit(1);
}

const {
  addVat,
  foldTurkish,
  formatLira,
  isIban,
  isTckn,
  liraInWords,
  normalizePhone,
  parseLira,
  slugify,
} = await import(BUILD_URL.href);

const WARMUP_ROUNDS = 3;
const TITLE = "Ön Fren Balatası Takımı (Seramik) — Şanzıman Uyumlu";
const LONG_TEXT = TITLE.repeat(50);

const scenarios = [
  ["slugify: product title", 200_000, () => slugify(TITLE)],
  [
    "slugify: 2.5 kB text, maxLength 80",
    2_000,
    () => slugify(LONG_TEXT, { maxLength: 80 }),
  ],
  ["foldTurkish: product title", 200_000, () => foldTurkish(TITLE)],
  ['parseLira: "1.234.567,89 TL"', 500_000, () => parseLira("1.234.567,89 TL")],
  ["formatLira: 123456789", 500_000, () => formatLira(123456789)],
  ["liraInWords: 123456789", 200_000, () => liraInWords(123456789)],
  ["addVat: 20%", 1_000_000, () => addVat(123456, 20)],
  ["isTckn", 1_000_000, () => isTckn("10000000146")],
  ["isIban: spaced", 500_000, () => isIban("TR33 0006 1005 1978 6457 8413 26")],
  [
    'normalizePhone: "0 (532) 123 45 67"',
    500_000,
    () => normalizePhone("0 (532) 123 45 67"),
  ],
];

const measure = (run, iterations) => {
  // Warm-up rounds let the JIT tier the function up before anything is timed.
  for (let round = 0; round < WARMUP_ROUNDS; round++) {
    for (let i = 0; i < iterations; i++) run();
  }
  const startedAt = performance.now();
  for (let i = 0; i < iterations; i++) run();
  return performance.now() - startedAt;
};

console.log(
  `Node ${process.version} · ${cpus()[0]?.model ?? "unknown CPU"} · ${process.platform}/${process.arch}\n`
);
console.log("| Scenario | Iterations | Total (ms) | µs/op |");
console.log("| --- | ---: | ---: | ---: |");
for (const [name, iterations, run] of scenarios) {
  const totalMs = measure(run, iterations);
  const microsPerOp = (totalMs * 1_000) / iterations;
  console.log(
    `| ${name} | ${iterations.toLocaleString("en-US")} | ${totalMs.toFixed(1)} | ${microsPerOp.toFixed(3)} |`
  );
}
