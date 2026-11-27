# @handijitcom/tr

<p align="center">
  <a href="https://www.npmjs.com/package/@handijitcom/tr"><img alt="npm version" src="https://img.shields.io/npm/v/@handijitcom/tr.svg" /></a>
  <a href="https://www.npmjs.com/package/@handijitcom/tr"><img alt="npm downloads" src="https://img.shields.io/npm/dy/@handijitcom/tr" /></a>
  <a href="./LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
</p>

Dependency-free helpers for software built for Türkiye: Turkish-aware slugs,
search folding, casing and sorting; lira amounts kept in integer kuruş (parse,
format, spell out, VAT); TCKN, VKN, IBAN and phone validation; `dd.MM.yyyy`
dates; and the 81 provinces with their plate codes.

- **21 functions + 1 data table, 0 runtime dependencies.**
- **3.58 kB gzip** for the whole minified browser bundle; tree-shakeable
  (`"sideEffects": false`).
- **No floats in money.** Amounts are integer kuruş; arithmetic runs on
  `bigint`, and every function accepts a `bigint` for amounts beyond
  `Number.MAX_SAFE_INTEGER`.
- **Locale-independent.** `I → ı` and `İ → i` are handled by the package, not by
  the runtime's default locale.
- **ESM, CommonJS and a `<script>` build** (global `handijitTr`), each with its
  own type declarations.
- **320 tests, 100% coverage** of statements, branches, functions and lines,
  enforced in CI.

---

## Table of contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Quick start](#quick-start)
- [When to use it](#when-to-use-it)
- [API reference](#api-reference)
  - [Text](#text) — `slugify`, `foldTurkish`, `toLowerTr`, `toUpperTr`, `compareTr`
  - [Money](#money) — `parseLira`, `formatLira`, `liraInWords`
  - [VAT](#vat) — `addVat`, `removeVat`, `vatOf`
  - [Validation](#validation) — `isTckn`, `isVkn`, `isIban`, `formatIban`, `normalizePhone`, `isMobilePhone`, `formatPhone`
  - [Dates](#dates) — `formatDateTr`, `parseDateTr`
  - [Provinces](#provinces) — `PROVINCES`, `provinceByPlate`
- [Semantics](#semantics)
- [Performance](#performance)
- [Bundle size](#bundle-size)
- [Contributing](#contributing)
- [Releasing](#releasing)
- [License](#license)

## Requirements

- Node.js 24 or newer, or any ES2022 browser.
- `compareTr` uses `Intl.Collator("tr")`; Node.js ships the Turkish locale data
  by default, as do all evergreen browsers.

## Installation

```bash
npm install @handijitcom/tr
# or
yarn add @handijitcom/tr
# or
pnpm add @handijitcom/tr
```

## Quick start

```ts
import {
  addVat,
  formatLira,
  isTckn,
  normalizePhone,
  parseLira,
  slugify,
} from "@handijitcom/tr";

slugify("Ön Fren Balatası"); // "on-fren-balatasi"  →  /parca/on-fren-balatasi

const net = parseLira("1.234,56"); // 123456 (kuruş) or undefined
if (net !== undefined) formatLira(addVat(net, 20)); // "₺1.481,47"

isTckn("10000000146"); // true
normalizePhone("0 (532) 123 45 67"); // "+905321234567"
```

## When to use it

Use it when a product targets Turkish users and you need the small,
error-prone pieces every such project rewrites: URLs from Turkish titles, a
search that matches "ışık" with "ISIK", prices that never drift by a kuruş,
and form validation for identity, tax and bank numbers.

Not a fit for: currencies other than the lira, other locales, or full
date/time handling (time zones, durations). Districts (ilçe) are out of scope.

## API reference

Two input policies run through the whole package:

- **Validators, parsers and phone/IBAN formatters accept `unknown` and never
  throw.** Anything they cannot read gives `false` or `undefined`.
- **Text, money and date functions throw on programmer errors**: a non-string
  text is a `TypeError`; a fractional, `NaN`, infinite or unsafe kuruş amount, a
  negative rate or an invalid date is a `RangeError`. Messages name the
  function, e.g. `formatLira: expected a safe integer amount of kuruş, received 1.5`.

### Text

#### `slugify(text, options?)`

```ts
slugify(text: string, options?: SlugifyOptions): string
```

Transliterates Turkish letters (`ç ğ ı İ ö ş ü` and `â î û`; other accents
such as `é` too), lower-cases, turns every run of other characters into a single
`-` and trims dashes at both ends.

| Option      | Type     | Default  | Description                                                                                                                                                                                         |
| ----------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxLength` | `number` | no limit | Longest slug; a longer one is cut at the last word boundary that fits. A single word longer than the limit is cut hard. `NaN`, non-numbers and values below 1 mean no limit; fractions are floored. |

```ts
slugify("Kâğıt Havlu (12'li)"); // "kagit-havlu-12-li"
slugify("Ön Fren Balatası", { maxLength: 10 }); // "on-fren"
slugify("!!!"); // ""
```

#### `foldTurkish(text)`

```ts
foldTurkish(text: string): string
```

Search normalization: Turkish lower-casing, then ASCII folding, then every
whitespace run collapsed to one space and trimmed. Punctuation is kept.

```ts
foldTurkish("  IŞIK  Çağrı "); // "isik cagri"
foldTurkish("İSTANBUL") === foldTurkish("istanbul"); // true
```

#### `toLowerTr(text)` / `toUpperTr(text)`

```ts
toLowerTr(text: string): string
toUpperTr(text: string): string
```

Case conversion with Turkish rules in any runtime locale.

```ts
toLowerTr("IĞDIR"); // "ığdır"
toLowerTr("İZMİR"); // "izmir"
toUpperTr("izmir"); // "İZMİR"
```

#### `compareTr(a, b)`

```ts
compareTr(a: string, b: string): number
```

Turkish alphabetical order through `Intl.Collator("tr")` (`c < ç < d`,
`h < ı < i`). Returns a negative number, zero or a positive number; pass it to
`sort`.

```ts
["Zeynep", "Çiğdem", "Ceren"].sort(compareTr); // ["Ceren", "Çiğdem", "Zeynep"]
```

### Money

All amounts are **integer kuruş** (`1 lira = 100 kuruş`), typed `Kurus =
number | bigint`. Numbers must be safe integers; pass a `bigint` for larger
amounts.

#### `parseLira(text)`

```ts
parseLira(text: unknown): number | undefined
```

Reads a Turkish-formatted amount: dots group thousands, a comma starts one or
two kuruş digits. An optional leading `-`, a leading `₺` and a trailing `₺`,
`TL` or `TRY` are accepted.

```ts
parseLira("1.234,56"); // 123456
parseLira("1234,5"); // 123450
parseLira("₺1.234"); // 123400
parseLira("12.5"); // undefined (a dot never starts a fraction)
parseLira("abc"); // undefined
```

Returns `undefined` for non-strings, malformed text and amounts above
`Number.MAX_SAFE_INTEGER` kuruş.

#### `formatLira(kurus, options?)`

```ts
formatLira(kurus: Kurus, options?: FormatLiraOptions): string
```

| Option     | Type      | Default | Description                                                              |
| ---------- | --------- | ------- | ------------------------------------------------------------------------ |
| `symbol`   | `boolean` | `true`  | Prefix `₺`. Only `false` turns it off.                                   |
| `fraction` | `boolean` | `true`  | Show two kuruş digits. `false` rounds half away from zero to whole lira. |

```ts
formatLira(123456); // "₺1.234,56"
formatLira(-5); // "-₺0,05"
formatLira(123456, { symbol: false }); // "1.234,56"
formatLira(123456, { fraction: false }); // "₺1.235"
```

#### `liraInWords(kurus)`

```ts
liraInWords(kurus: Kurus): string
```

Spells an amount out in Turkish, as on cheques and invoices. Words are
separated by spaces; negatives start with `eksi`. Up to 999 kentilyon
(10²¹ − 1) lira; larger amounts throw a `RangeError`.

```ts
liraInWords(123456); // "bin iki yüz otuz dört lira elli altı kuruş"
liraInWords(0); // "sıfır lira"
liraInWords(5); // "beş kuruş"
```

### VAT

```ts
addVat(netKurus: number, ratePercent: number): number      // bigint in → bigint out
removeVat(grossKurus: number, ratePercent: number): number // bigint in → bigint out
vatOf(kurus: number, ratePercent: number, options?: VatOfOptions): number
```

`ratePercent` is the rate in percent (`20`, `10`, `1`, `0.5`) with at most two
decimals; negative, `NaN` or finer rates throw a `RangeError`.

| Option (`vatOf`) | Type               | Default | Description                                                                          |
| ---------------- | ------------------ | ------- | ------------------------------------------------------------------------------------ |
| `from`           | `"net" \| "gross"` | `"net"` | `"net"`: the VAT on top of the amount. `"gross"`: the VAT already inside the amount. |

**Rounding.** Every result is rounded to the kuruş **half away from zero**
(0.5 kuruş → 1, −0.5 → −1), so a refund mirrors its sale.

- `addVat(net) = net + round(net × rate)`
- `removeVat(gross) = round(gross ÷ (1 + rate))`
- `vatOf(gross, rate, { from: "gross" }) = gross − removeVat(gross, rate)`, so
  net + VAT always equals the gross exactly.
- Rounding means `addVat(removeVat(g))` can differ from `g` by a kuruş.

```ts
addVat(10000, 20); // 12000
addVat(999, 20); // 1199  (199.8 → 200)
removeVat(1199, 20); // 999 (999.17 → 999)
vatOf(1199, 20, { from: "gross" }); // 200
```

### Validation

| Function                | Returns               | Accepts                                                        |
| ----------------------- | --------------------- | -------------------------------------------------------------- |
| `isTckn(value)`         | `boolean`             | 11 digits, first not `0`, both check digits valid.             |
| `isVkn(value)`          | `boolean`             | 10 digits with a valid check digit.                            |
| `isIban(value)`         | `boolean`             | `TR` + 24 digits, mod-97 valid. Spaces and lower case allowed. |
| `formatIban(value)`     | `string \| undefined` | A valid IBAN, grouped by four.                                 |
| `normalizePhone(value)` | `string \| undefined` | A Turkish number in E.164 form.                                |
| `isMobilePhone(value)`  | `boolean`             | A normalizable number whose national part starts with `5`.     |
| `formatPhone(value)`    | `string \| undefined` | A normalizable number as `0532 123 45 67`.                     |

All take `unknown`; non-strings give `false` / `undefined`. TCKN and VKN are
strict: no spaces, strings only (a number would lose leading zeros).

```ts
isTckn("10000000146"); // true
isVkn("1234567890"); // true
isIban("TR33 0006 1005 1978 6457 8413 26"); // true
formatIban("tr330006100519786457841326"); // "TR33 0006 1005 1978 6457 8413 26"
normalizePhone("0532 123 45 67"); // "+905321234567"
formatPhone("+905321234567"); // "0532 123 45 67"
```

`normalizePhone` ignores spaces, dashes, dots and parentheses, then accepts an
optional `+90`, `0090`, `90` or `0` prefix followed by a 10-digit national
number starting with `2`–`5` or `8` (landlines, mobiles, `850` numbers).

### Dates

```ts
formatDateTr(date: Date | number): string     // "dd.MM.yyyy"
parseDateTr(text: unknown): Date | undefined
```

Both work in **Türkiye time, a fixed UTC+03:00** (the country's offset all
year since September 2016), so a server in UTC and a browser anywhere print the
same day. `parseDateTr` returns the start of that day in Türkiye.

```ts
formatDateTr(new Date("2026-11-26T21:00:00Z")); // "27.11.2026"
parseDateTr("27.11.2026"); // 2026-11-26T21:00:00.000Z
parseDateTr("7/3/2026"); // 7 March 2026
parseDateTr("31.04.2026"); // undefined
```

`parseDateTr` accepts `d.M.yyyy` or `dd.MM.yyyy` with `.` or `/` (the same
separator twice) and rejects impossible days. `formatDateTr` throws a
`TypeError` for anything but a `Date` or a number and a `RangeError` for an
invalid date or a year outside 0–9999.

Known limit: for instants before September 2016 that fall in a winter
(UTC+02:00) evening between 21:00 and 22:00 UTC, the fixed offset reads the next
day.

### Provinces

```ts
PROVINCES: readonly Province[]  // { plate: number; name: string }, ordered by plate
provinceByPlate(plate: number | string): Province | undefined
```

```ts
PROVINCES.length; // 81
provinceByPlate(34); // { plate: 34, name: "İstanbul" }
provinceByPlate("06"); // { plate: 6, name: "Ankara" }
provinceByPlate(82); // undefined
```

The table and its entries are frozen. Sort names with `compareTr`.

## Semantics

| Input                                  | Behaviour                                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `""`                                   | Text functions return `""`; parsers return `undefined`; validators `false`.                                                           |
| Non-string text                        | `slugify`, `foldTurkish`, `toLowerTr`, `toUpperTr`, `compareTr` throw `TypeError`; parsers / validators return `undefined` / `false`. |
| `NaN`, `±Infinity`, `1.5` kuruş        | `RangeError` (a kuruş amount must be an integer).                                                                                     |
| `-0` kuruş                             | Treated as `0`: `formatLira(-0)` → `"₺0,00"`.                                                                                         |
| Amount above `Number.MAX_SAFE_INTEGER` | Pass a `bigint`; a number result that would exceed it throws `RangeError`; `parseLira` returns `undefined`.                           |
| `"1.23"` / `"12.5"` to `parseLira`     | `undefined`: in Turkish a dot only groups thousands.                                                                                  |
| Invalid `Date`                         | `formatDateTr` throws `RangeError`.                                                                                                   |

## Performance

`npm run bench` on the built output (Node v26.11.0 · Apple M5 · darwin/arm64):

| Scenario                            |  µs/op |
| ----------------------------------- | -----: |
| slugify: product title              |  0.774 |
| slugify: 2.5 kB text, maxLength 80  | 23.680 |
| foldTurkish: product title          |  0.771 |
| parseLira: "1.234.567,89 TL"        |  0.109 |
| formatLira: 123456789               |  0.056 |
| liraInWords: 123456789              |  0.344 |
| addVat: 20%                         |  0.008 |
| isTckn                              |  0.020 |
| isIban: spaced                      |  0.233 |
| normalizePhone: "0 (532) 123 45 67" |  0.097 |

## Bundle size

| File                 | Raw      | Gzip    | Brotli  |
| -------------------- | -------- | ------- | ------- |
| `build/index.mjs`    | 22.95 kB | 7.75 kB | 6.63 kB |
| `build/index.cjs`    | 23.41 kB | 7.82 kB | 6.69 kB |
| `build/index.umd.js` | 8.54 kB  | 3.58 kB | 3.16 kB |
| `build/index.d.ts`   | 5.40 kB  | 2.01 kB | 1.72 kB |

The minified browser bundle has a 4 kB gzip budget, enforced by `npm run size`.

| Entry                | File                                       |
| -------------------- | ------------------------------------------ |
| ESM (`import`)       | `build/index.mjs` + `build/index.d.mts`    |
| CommonJS (`require`) | `build/index.cjs` + `build/index.d.ts`     |
| `<script>`           | `build/index.umd.js` (global `handijitTr`) |

## Contributing

```bash
npm install
npm run verify      # lint (ESLint + Prettier), typecheck, test with coverage, build, size budget, package lint
npm run test:smoke  # install the packed tarball in a clean project and load it (after a build)
npm run bench       # measure the built output
```

The ESLint, Prettier, TypeScript and Vitest settings come from
[`@handijitcom/config`](https://github.com/handijit/config)'s library presets;
CI runs the gate on Node 24 (the engines floor) and 26 (the Active LTS).

320 tests, enforced at 100% for statements, branches, functions and lines. A
change to a public function comes with its tests, a README update and a
CHANGELOG entry.

## Releasing

Releases are automatic and happen only from CI:

1. Move the entries under `Unreleased` in [CHANGELOG.md](./CHANGELOG.md) to a
   new version heading.
2. Bump the version: `npm version patch` (or `minor` / `major`).
3. Merge to `master`.

The publish workflow then runs `npm run verify`, smoke-tests the packed tarball
through both `import` and `require`, publishes to npm with provenance (token in
the `NPM_ACCESS_TOKEN` repository secret), pushes a `v<version>` tag and creates
a GitHub Release from the CHANGELOG section. A commit that does not change the
version is skipped.

<!-- handijit:about:start -->

## About Han Dijit

`@handijitcom/tr` is built and maintained by **[Han Dijit](https://www.handijit.com)**, a software company serving businesses across Türkiye: web, e-commerce, mobile, artificial intelligence, cyber security and enterprise software projects.

[www.handijit.com](https://www.handijit.com) · [All Han Dijit packages on npm](https://www.npmjs.com/org/handijitcom)
<!-- handijit:about:end -->

## License

MIT © [Han Dijit](https://github.com/handijit)
