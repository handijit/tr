import { existsSync } from "node:fs";
import { cpus } from "node:os";
import { performance } from "node:perf_hooks";

// The published artefact is what consumers run, so that is what gets measured, not the source.
const BUILD_URL = new URL("../build/index.mjs", import.meta.url);
if (!existsSync(BUILD_URL)) {
  console.error('bench: build/index.mjs is missing; run "npm run build" first');
  process.exit(1);
}

// Timed before the module is warm: the first date call builds the Intl formatter and the
// first name lookup builds the province index. Everything after reuses them.
const timeOnce = (run) => {
  const startedAt = performance.now();
  run();
  return performance.now() - startedAt;
};

const api = await import(BUILD_URL.href);
const coldDateMs = timeOnce(() => api.formatDateTime(0));
const coldProvinceMs = timeOnce(() => api.getProvinceByName("İstanbul"));

const WARMUP_ROUNDS = 3;

const SHORT_TEXT = "ığdır istasyonu";
const LONG_TEXT = "Şişli'de ıhlamur ağaçlarının gölgesinde çay içtik. ".repeat(
  200
);
const INSTANT = Date.UTC(2026, 10, 10, 11, 30);
const NAMES = api.PROVINCES.map((province) => province.name);

const scenarios = [
  ["toUpperCase: 15 characters", 1_000_000, () => api.toUpperCase(SHORT_TEXT)],
  ["toUpperCase: 10 000 characters", 2_000, () => api.toUpperCase(LONG_TEXT)],
  ["toTitleCase: 15 characters", 1_000_000, () => api.toTitleCase(SHORT_TEXT)],
  ["foldText: 15 characters", 1_000_000, () => api.foldText(SHORT_TEXT)],
  ["foldText: 10 000 characters", 2_000, () => api.foldText(LONG_TEXT)],
  ["slugify: 15 characters", 1_000_000, () => api.slugify(SHORT_TEXT)],
  [
    "compareTurkish: two province names",
    1_000_000,
    () => api.compareTurkish("İstanbul", "Isparta"),
  ],
  [
    "compareTurkish: sort 81 province names",
    10_000,
    () => [...NAMES].sort(api.compareTurkish),
  ],
  ["isValidTckn: valid", 1_000_000, () => api.isValidTckn("10000000146")],
  ["isValidVkn: valid", 1_000_000, () => api.isValidVkn("1234567890")],
  [
    "isValidIban: valid, with spaces",
    1_000_000,
    () => api.isValidIban("TR33 0006 1005 1978 6457 8413 26"),
  ],
  [
    "formatIban: compact input",
    1_000_000,
    () => api.formatIban("TR330006100519786457841326"),
  ],
  [
    "normalizePhone: 0 (532) 123 45 67",
    1_000_000,
    () => api.normalizePhone("0 (532) 123 45 67"),
  ],
  [
    "formatPhone: +905321234567",
    1_000_000,
    () => api.formatPhone("+905321234567"),
  ],
  ["formatMoney: 349050", 1_000_000, () => api.formatMoney(349050)],
  [
    "formatMoney: largest safe amount",
    1_000_000,
    () => api.formatMoney(Number.MAX_SAFE_INTEGER),
  ],
  ["parseMoney: 3.490,50 TL", 1_000_000, () => api.parseMoney("3.490,50 TL")],
  ["moneyToWords: 349050", 1_000_000, () => api.moneyToWords(349050)],
  [
    "moneyToWords: largest safe amount",
    1_000_000,
    () => api.moneyToWords(Number.MAX_SAFE_INTEGER),
  ],
  [
    "formatDate: calendar date string",
    1_000_000,
    () => api.formatDate("2026-11-10"),
  ],
  ["formatDate: instant", 200_000, () => api.formatDate(INSTANT)],
  ["formatDateTime: instant", 200_000, () => api.formatDateTime(INSTANT)],
  ["getDayName: instant", 200_000, () => api.getDayName(INSTANT)],
  ["parseDate: 10.11.2026", 1_000_000, () => api.parseDate("10.11.2026")],
  ["getProvinceByCode: 34", 1_000_000, () => api.getProvinceByCode(34)],
  [
    "getProvinceByName: İstanbul",
    1_000_000,
    () => api.getProvinceByName("İstanbul"),
  ],
  [
    "isValidLicensePlate: 34 ABC 123",
    1_000_000,
    () => api.isValidLicensePlate("34 ABC 123"),
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

console.log(
  `\nCold start, measured once in a fresh process: first formatDateTime ${coldDateMs.toFixed(2)} ms, first getProvinceByName ${coldProvinceMs.toFixed(2)} ms.`
);
