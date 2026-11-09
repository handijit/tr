# @handijit/tr

[![npm version](https://img.shields.io/npm/v/@handijit/tr.svg)](https://www.npmjs.com/package/@handijit/tr)
[![npm downloads](https://img.shields.io/npm/dm/@handijit/tr.svg)](https://www.npmjs.com/package/@handijit/tr)
[![license](https://img.shields.io/npm/l/@handijit/tr.svg)](./LICENSE)

Text, validation and formatting helpers for software that is used in Turkey:
upper and lower case that get "i" and "ı" right, alphabetical sorting, search
keys and slugs, T.C. identity number, tax number, IBAN and phone validation,
lira amounts in digits and in words, `dd.MM.yyyy` dates, the 81 provinces and
licence plates. Every function is pure and gives the same answer in Node, in a
browser and in Electron, whatever locale the machine is set to.

- **0 runtime dependencies.**
- **4.36 kB gzip** for the whole minified bundle (3.96 kB
  brotli). Every function is its own module and the package is marked
  `"sideEffects": false`, so a bundler keeps only what you import.
- **No locale data needed.** Casing, sorting, money and the month and day names
  are implemented in the package; nothing depends on the ICU data the runtime
  was built with or on the locale of the machine. `Intl.DateTimeFormat` is used
  in one place only: to move an instant into a time zone.
- **Money never touches a float.** Amounts are whole kuruş (`number`, safe
  integers) from parsing to formatting.
- **Linear time, bounded memory.** Every function is O(n) in the length of its
  input, every regular expression is linear, and the two internal caches are
  capped (8 date formatters, 81 province names).
- **1200 tests, 100% statement, branch, function and line coverage**,
  plus a type test for every signature. The examples in this file are checked
  by a test as well.
- **ESM, CommonJS, a `<script>` bundle and TypeScript declarations** in one
  package. Node 24 or newer.

## Table of contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Quick start](#quick-start)
- [When to use it](#when-to-use-it)
- [API reference](#api-reference)
  - [Text](#text): [`toUpperCase`](#touppercase),
    [`toLowerCase`](#tolowercase), [`capitalize`](#capitalize),
    [`toTitleCase`](#totitlecase), [`compareTurkish`](#compareturkish),
    [`foldText`](#foldtext), [`slugify`](#slugify)
  - [Identity and bank numbers](#identity-and-bank-numbers):
    [`isValidTckn`](#isvalidtckn), [`isValidVkn`](#isvalidvkn),
    [`isValidIban`](#isvalidiban), [`normalizeIban`](#normalizeiban),
    [`formatIban`](#formatiban)
  - [Phone numbers](#phone-numbers): [`isValidPhone`](#isvalidphone),
    [`getPhoneType`](#getphonetype), [`normalizePhone`](#normalizephone),
    [`formatPhone`](#formatphone)
  - [Money](#money): [`formatMoney`](#formatmoney),
    [`parseMoney`](#parsemoney), [`moneyToWords`](#moneytowords)
  - [Dates](#dates): [`formatDate`](#formatdate),
    [`formatDateTime`](#formatdatetime), [`parseDate`](#parsedate),
    [`getMonthName`](#getmonthname), [`getDayName`](#getdayname),
    [`MONTH_NAMES`](#month_names), [`DAY_NAMES`](#day_names)
  - [Geography](#geography): [`PROVINCES`](#provinces),
    [`getProvinceByCode`](#getprovincebycode),
    [`getProvinceByName`](#getprovincebyname),
    [`isValidLicensePlate`](#isvalidlicenseplate)
- [Guides](#guides)
- [Server-side rendering and Electron](#server-side-rendering-and-electron)
- [Semantics](#semantics)
- [Performance](#performance)
- [Bundle size](#bundle-size)
- [TypeScript](#typescript)
- [FAQ and troubleshooting](#faq-and-troubleshooting)
- [Breaking changes](#breaking-changes)
- [Contributing](#contributing)
- [Releasing](#releasing)
- [License](#license)

## Requirements

- **Node.js 24 or newer** (`engines.node`). CI runs on Node 24 and 26.
- **Browsers and Electron:** any engine that runs ES2023 syntax. The build is
  not downlevelled. Beyond the syntax the package needs regular expression
  lookbehind (`toTitleCase`), Unicode property escapes (`toTitleCase`,
  `compareTurkish`) and `Intl.DateTimeFormat` with IANA time zones (the date
  functions, when they are given a `Date` or a timestamp).
- No DOM, no Node API: the package reads nothing from `window`, `navigator`,
  `process` or the file system.

## Installation

```bash
npm install @handijit/tr
```

```bash
yarn add @handijit/tr
```

```bash
pnpm add @handijit/tr
```

## Quick start

```ts
import {
  compareTurkish,
  formatDate,
  formatMoney,
  formatPhone,
  isValidTckn,
  moneyToWords,
  parseMoney,
  toUpperCase,
} from "@handijit/tr";

toUpperCase("iyi günler"); // → "İYİ GÜNLER"
["Çorum", "Bolu", "Ağrı"].sort(compareTurkish); // → ["Ağrı", "Bolu", "Çorum"]
isValidTckn("10000000146"); // → true
formatPhone("+905321234567"); // → "0 (532) 123 45 67"
parseMoney("3.490,50 TL"); // → 349050
formatMoney(349050); // → "3.490,50 TL"
moneyToWords(349050); // → "üç bin dört yüz doksan Türk lirası elli kuruş"
formatDate("2026-11-10"); // → "10.11.2026"
```

Every line marked `// →` in this file, and every `// throws` line, is checked
against the code by `__tests__/readme.test.ts`.

## When to use it

Use it when

- your interface is in Turkish and `"iyi günler".toUpperCase()` giving
  `"IYI GÜNLER"` is a bug for you,
- the same text has to come out of the server and out of the browser
  (server-side rendering, PDFs, e-mails, an Electron main and renderer process)
  and you cannot count on both sides having the same locale data,
- you check a T.C. identity number, a tax number, an IBAN, a phone number or a
  licence plate in a form before it goes to a server,
- you keep money as whole kuruş and need to read it from, and write it back
  to, the form people type it in (`3.490,50`).

Do not use it when

- you need more than one locale: use `Intl` or an internationalisation library,
- you need to know that an identity number belongs to a real person or that an
  IBAN belongs to an open account: these functions check the arithmetic of the
  number, not a registry,
- you handle phone numbers or IBANs of other countries: only Turkish ones pass,
- you keep money as a floating-point number of lira: convert to kuruş first.

## API reference

All 30 exports are named exports of `@handijit/tr`; there is no default
export and there are no deep imports.

How invalid input is handled follows one rule, spelled out in
[Semantics](#semantics): the `isValid…` functions accept any value and answer
`false`; functions that read text a person typed return `null` when it cannot
be read; a value of the wrong type is a programming error and throws.

### Text

#### `toUpperCase`

```ts
toUpperCase(text: string): string
```

| Parameter | Type     | Default  | Description         |
| --------- | -------- | -------- | ------------------- |
| `text`    | `string` | required | Text to upper-case. |

**Returns** the text in upper case by the Turkish rule: "i" becomes "İ" and
"ı" becomes "I". Every other character follows the Unicode default mapping.

```ts
toUpperCase("iyi günler"); // → "İYİ GÜNLER"
toUpperCase("ılık su"); // → "ILIK SU"
"iyi günler".toUpperCase(); // → "IYI GÜNLER"
```

- The result is the same as `text.toLocaleUpperCase("tr-TR")` on a runtime
  with full locale data, and stays that way on a runtime without it.
- The default mapping can lengthen the text: "ß" becomes "SS".
- `toUpperCase("")` is `""`. A value that is not a string throws a
  `TypeError`.

#### `toLowerCase`

```ts
toLowerCase(text: string): string
```

| Parameter | Type     | Default  | Description         |
| --------- | -------- | -------- | ------------------- |
| `text`    | `string` | required | Text to lower-case. |

**Returns** the text in lower case by the Turkish rule: "I" becomes "ı" and
"İ" becomes "i".

```ts
toLowerCase("IŞIK İLE DİYARBAKIR"); // → "ışık ile diyarbakır"
"IŞIK".toLowerCase(); // → "işik"
```

- "İ" written as two characters ("I" followed by the combining dot above,
  U+0307) is read as "İ" and becomes a plain "i".
- One rare sequence differs from `toLocaleLowerCase("tr-TR")`: "I", then some
  other combining mark, then U+0307. See
  [Known limitations](#known-limitations).

#### `capitalize`

```ts
capitalize(text: string): string
```

| Parameter | Type     | Default  | Description                               |
| --------- | -------- | -------- | ----------------------------------------- |
| `text`    | `string` | required | Text whose first letter is to be capital. |

**Returns** the text with its first character upper-cased by the Turkish rule.
The rest is left exactly as written.

```ts
capitalize("izmir"); // → "İzmir"
capitalize("ısparta"); // → "Isparta"
capitalize("istanbul BÜYÜKŞEHİR"); // → "İstanbul BÜYÜKŞEHİR"
capitalize(""); // → ""
```

- The first character is taken by code point, so an emoji or another character
  outside the Basic Multilingual Plane is not cut in half.
- Leading whitespace is not skipped: `capitalize(" izmir")` changes nothing.

#### `toTitleCase`

```ts
toTitleCase(text: string): string
```

| Parameter | Type     | Default  | Description                   |
| --------- | -------- | -------- | ----------------------------- |
| `text`    | `string` | required | Text to write in title style. |

**Returns** the text with every word starting with a Turkish capital letter
and continuing in lower case.

```ts
toTitleCase("ığdır İL özel idaresi"); // → "Iğdır İl Özel İdaresi"
toTitleCase("ANKARA'DA KIŞ"); // → "Ankara'da Kış"
toTitleCase("iş-yeri (izmir)"); // → "İş-Yeri (İzmir)"
toTitleCase("ahmet ve ayşe"); // → "Ahmet Ve Ayşe"
```

- A word starts at a letter that does not follow a letter, a digit, a
  combining mark or an apostrophe. A suffix after an apostrophe therefore
  stays small ("Ankara'da"), and so does a letter after a digit ("5a").
- There is no list of small words: "ve", "ile" and "veya" are capitalised
  like any other word.
- The whole text is lower-cased first, so an abbreviation written in capitals
  ("KDV") comes out as "Kdv".

#### `compareTurkish`

```ts
compareTurkish(left: string, right: string): number
```

| Parameter | Type     | Default  | Description  |
| --------- | -------- | -------- | ------------ |
| `left`    | `string` | required | First text.  |
| `right`   | `string` | required | Second text. |

**Returns** `-1` when `left` sorts before `right` in the Turkish alphabet, `1`
when it sorts after, and `0` when the two are the same text. Pass it to
`Array.prototype.sort`.

```ts
const cities = ["Çorum", "Bolu", "Ağrı", "Iğdır", "İzmir", "Zonguldak"];
[...cities].sort(compareTurkish); // → ["Ağrı", "Bolu", "Çorum", "Iğdır", "İzmir", "Zonguldak"]
[...cities].sort(); // → ["Ağrı", "Bolu", "Iğdır", "Zonguldak", "Çorum", "İzmir"]
compareTurkish("ılık", "ihtiyaç"); // → -1
compareTurkish("çay", "cuma"); // → 1
["kâr", "Kar", "kar", "kara"].sort(compareTurkish); // → ["kar", "Kar", "kâr", "kara"]
```

- The order of letters is `a b c ç d e f g ğ h ı i j k l m n o ö p q r s ş t
u ü v w x y z`. ASCII punctuation and spaces sort before digits, digits
  before letters, and every other character after the letters, by code point.
- Letters decide first. Only when two texts have the same letters does an
  accent decide ("kar" before "kâr"), and after that the case, lower case
  first ("kar" before "Kar").
- It is not a natural sort: digits are compared one by one, so "a10" sorts
  before "a2".
- The comparator is a total order (consistent, transitive), so the result of
  a sort does not depend on the engine. It returns `0` only for texts that
  are equal after Unicode composition (NFC).
- It does not use `Intl.Collator`. On the word list of the test suite it
  agrees with `Intl.Collator("tr-TR")`; it is not a full implementation of
  the Unicode Collation Algorithm.

#### `foldText`

```ts
foldText(text: string): string
```

| Parameter | Type     | Default  | Description                     |
| --------- | -------- | -------- | ------------------------------- |
| `text`    | `string` | required | Text to turn into a search key. |

**Returns** a key for case-insensitive, accent-insensitive search: the text
in Turkish lower case with "ç ğ ı ö ş ü" replaced by "c g i o s u" and every
other accent removed. Fold both the text and the query, then compare.

```ts
foldText("Çağrı IŞIK"); // → "cagri isik"
foldText("İstanbul"); // → "istanbul"
foldText("Kâğıt"); // → "kagit"
foldText("Şişli").includes(foldText("SIS")); // → true
```

- Both "I" and "İ" end up as "i", so a search matches whichever keyboard the
  query was typed on.
- Characters are not removed and spaces are not collapsed; only letters
  change. A letter that has no base letter in Unicode keeps its form ("ß"
  stays "ß").
- The key is for comparing, not for showing: it cannot be turned back into
  the text.

#### `slugify`

```ts
slugify(text: string): string
```

| Parameter | Type     | Default  | Description               |
| --------- | -------- | -------- | ------------------------- |
| `text`    | `string` | required | Text to turn into a slug. |

**Returns** a slug made of `a` to `z`, `0` to `9` and single hyphens, safe in
a URL and in a file name.

```ts
slugify("Şırnak İl Özel İdaresi"); // → "sirnak-il-ozel-idaresi"
slugify("  Ön Muhasebe & Stok Takibi (2026)  "); // → "on-muhasebe-stok-takibi-2026"
slugify("Kâğıt, Karton"); // → "kagit-karton"
slugify("!!!"); // → ""
```

- Every run of other characters becomes one hyphen; hyphens at the ends are
  dropped.
- The result is empty when the text has no letter or digit that survives.
  Check for `""` before you use it as an identifier.
- Letters without a Latin base letter are not transliterated:
  `slugify("straße")` is `"stra-e"`.

### Identity and bank numbers

The three validators check the arithmetic of a number. They cannot tell
whether the number was ever issued.

#### `isValidTckn`

```ts
isValidTckn(value: unknown): boolean
```

| Parameter | Type      | Default  | Description                   |
| --------- | --------- | -------- | ----------------------------- |
| `value`   | `unknown` | required | The identity number, as text. |

**Returns** `true` when the value is a string of 11 digits that does not
start with 0 and whose tenth and eleventh digits are the check digits of the
first nine.

```ts
isValidTckn("10000000146"); // → true
isValidTckn("100 000 001 46"); // → true
isValidTckn("10000000147"); // → false
isValidTckn("00000000000"); // → false
isValidTckn(10000000146); // → false
```

- Whitespace anywhere in the text is ignored. Any other separator makes the
  value invalid.
- A number, `null`, `undefined` or any other non-string is `false`, never an
  error: pass `input.value` straight in.

#### `isValidVkn`

```ts
isValidVkn(value: unknown): boolean
```

| Parameter | Type      | Default  | Description              |
| --------- | --------- | -------- | ------------------------ |
| `value`   | `unknown` | required | The tax number, as text. |

**Returns** `true` when the value is a string of 10 digits whose last digit is
the check digit of the first nine (the tax identification number, "vergi
kimlik numarası").

```ts
isValidVkn("1234567890"); // → true
isValidVkn("123 456 78 90"); // → true
isValidVkn("1234567891"); // → false
isValidVkn("0000000000"); // → false
isValidVkn(1234567890); // → false
```

- Whitespace is ignored; a non-string is `false`.
- A sole proprietor is identified by the 11-digit T.C. identity number
  instead. To accept either, use `isValidVkn(value) || isValidTckn(value)`.

#### `isValidIban`

```ts
isValidIban(value: unknown): boolean
```

| Parameter | Type      | Default  | Description        |
| --------- | --------- | -------- | ------------------ |
| `value`   | `unknown` | required | The IBAN, as text. |

**Returns** `true` when the value is a Turkish IBAN: "TR", 24 digits, and a
correct ISO 13616 checksum (mod 97).

```ts
isValidIban("TR33 0006 1005 1978 6457 8413 26"); // → true
isValidIban("tr330006100519786457841326"); // → true
isValidIban("TR33 0006 1005 1978 6457 8413 27"); // → false
isValidIban("DE89 3704 0044 0532 0130 00"); // → false
```

- Whitespace and letter case are ignored.
- IBANs of other countries are `false`, whatever their checksum.
- The bank code inside the IBAN is not looked up.

#### `normalizeIban`

```ts
normalizeIban(value: string): string | null
```

| Parameter | Type     | Default  | Description               |
| --------- | -------- | -------- | ------------------------- |
| `value`   | `string` | required | The IBAN as it was typed. |

**Returns** the IBAN in the form to store and to send to a bank, 26
characters without spaces and in upper case, or `null` when it is not a valid
Turkish IBAN.

```ts
normalizeIban("tr33 0006 1005 1978 6457 8413 26"); // → "TR330006100519786457841326"
normalizeIban("TR33 0006 1005 1978 6457 8413 27"); // → null
```

#### `formatIban`

```ts
formatIban(value: string): string | null
```

| Parameter | Type     | Default  | Description                |
| --------- | -------- | -------- | -------------------------- |
| `value`   | `string` | required | The IBAN, in any spelling. |

**Returns** the IBAN in groups of four for reading, or `null` when it is not
a valid Turkish IBAN.

```ts
formatIban("TR330006100519786457841326"); // → "TR33 0006 1005 1978 6457 8413 26"
formatIban("tr33 0006 1005 1978 6457 8413 26"); // → "TR33 0006 1005 1978 6457 8413 26"
formatIban("TR33"); // → null
```

- It formats complete, valid IBANs only. It is not an input mask for a field
  that is still being typed in.

### Phone numbers

A Turkish phone number has the country code 90 and a ten-digit national
number. The first digit of the national number decides what it is: 5 is a
mobile line, 2, 3 and 4 are geographic (landline) area codes, 8 is a
non-geographic number such as 0850 and 0800.

All four functions read the same spellings: with or without `+90`, `0090`,
`90` or the leading `0`, and with spaces, hyphens, dots and parentheses as
separators.

#### `isValidPhone`

```ts
isValidPhone(value: unknown): boolean
```

| Parameter | Type      | Default  | Description                |
| --------- | --------- | -------- | -------------------------- |
| `value`   | `unknown` | required | The phone number, as text. |

**Returns** `true` when the value is a Turkish phone number in one of the
spellings above.

```ts
isValidPhone("0532 123 45 67"); // → true
isValidPhone("+90 (212) 123 45 67"); // → true
isValidPhone("532 123 45 67"); // → true
isValidPhone("444 0 123"); // → false
isValidPhone("+49 30 123456"); // → false
```

- Only the length and the first digit of the national number are checked.
  Whether an area code or an operator prefix is in use is not.
- Short numbers (444 xx xx, 112) and numbers of other countries are `false`.
- After a `+` the country code is required: `"+532 123 45 67"` is `false`.
- A non-string is `false`.

#### `getPhoneType`

```ts
getPhoneType(value: string): PhoneType | null

type PhoneType = "mobile" | "landline" | "nonGeographic";
```

| Parameter | Type     | Default  | Description       |
| --------- | -------- | -------- | ----------------- |
| `value`   | `string` | required | The phone number. |

**Returns** the kind of line, or `null` when the value is not a Turkish phone
number.

```ts
getPhoneType("0532 123 45 67"); // → "mobile"
getPhoneType("0212 123 45 67"); // → "landline"
getPhoneType("0850 123 45 67"); // → "nonGeographic"
getPhoneType("123"); // → null
```

- Use `getPhoneType(value) === "mobile"` for a field that must hold a mobile
  number, for example before sending an SMS.

#### `normalizePhone`

```ts
normalizePhone(value: string): string | null
```

| Parameter | Type     | Default  | Description                       |
| --------- | -------- | -------- | --------------------------------- |
| `value`   | `string` | required | The phone number as it was typed. |

**Returns** the number in E.164 form (`+90` and ten digits), the form to store
and to hand to an SMS or call service, or `null` when the value is not a
Turkish phone number.

```ts
normalizePhone("0 (532) 123 45 67"); // → "+905321234567"
normalizePhone("532-123-45-67"); // → "+905321234567"
normalizePhone("0090 212 123 45 67"); // → "+902121234567"
normalizePhone("0532 123 45 6"); // → null
normalizePhone("+1 212 555 01 00"); // → null
```

#### `formatPhone`

```ts
formatPhone(value: string, options?: FormatPhoneOptions): string | null

type FormatPhoneOptions = { style?: "national" | "international" };
```

| Parameter       | Type                            | Default      | Description                                                                     |
| --------------- | ------------------------------- | ------------ | ------------------------------------------------------------------------------- |
| `value`         | `string`                        | required     | The phone number, in any spelling.                                              |
| `options.style` | `"national" \| "international"` | `"national"` | `"national"` writes `0 (532) 123 45 67`, `"international"` `+90 532 123 45 67`. |

**Returns** the number written for reading, or `null` when the value is not a
Turkish phone number.

```ts
formatPhone("+905321234567"); // → "0 (532) 123 45 67"
formatPhone("05321234567", { style: "international" }); // → "+90 532 123 45 67"
formatPhone("0212 123 45 67", { style: "international" }); // → "+90 212 123 45 67"
formatPhone("12345"); // → null
```

- A `style` that is neither of the two names falls back to `"national"`.

### Money

Amounts are whole kuruş: 349050 is 3.490,50 TL. Keep them that way in your
state, your database and your arithmetic, and call these functions at the
edges, where a person types or reads the amount.

#### `formatMoney`

```ts
formatMoney(kurus: number, options?: FormatMoneyOptions): string

type FormatMoneyOptions = { symbol?: boolean };
```

| Parameter        | Type      | Default  | Description                                                             |
| ---------------- | --------- | -------- | ----------------------------------------------------------------------- |
| `kurus`          | `number`  | required | The amount in whole kuruş. May be negative.                             |
| `options.symbol` | `boolean` | `false`  | `true` writes the lira sign before the amount instead of `TL` after it. |

**Returns** the amount with dots between thousands, a comma before the two
kuruş digits, and the currency.

```ts
formatMoney(349050); // → "3.490,50 TL"
formatMoney(349050, { symbol: true }); // → "₺3.490,50"
formatMoney(5); // → "0,05 TL"
formatMoney(-1250); // → "-12,50 TL"
formatMoney(-1250, { symbol: true }); // → "-₺12,50"
formatMoney(123456789012); // → "1.234.567.890,12 TL"
formatMoney(0); // → "0,00 TL"
```

- The space before `TL` is an ordinary space and the minus is the ASCII
  hyphen-minus, so the text can be compared, searched and parsed back.
- `-0` is written without a sign.
- Only `symbol: true` switches the sign on; any other value means `TL`.
- An amount that is not a whole number, or lies outside the safe integer
  range, throws a `RangeError`; a value that is not a number throws a
  `TypeError`. Nothing is rounded for you:

```ts
formatMoney(12.5); // throws RangeError: formatMoney: expected a whole number of kuruş within the safe integer range, received 12.5
formatMoney("12,50"); // throws TypeError: formatMoney: expected an amount in kuruş as a number, received string
```

#### `parseMoney`

```ts
parseMoney(text: string): number | null
```

| Parameter | Type     | Default  | Description                 |
| --------- | -------- | -------- | --------------------------- |
| `text`    | `string` | required | The amount as it was typed. |

**Returns** the amount in whole kuruş, or `null` when the text is not an
amount in Turkish notation.

```ts
parseMoney("3.490,50 TL"); // → 349050
parseMoney("₺3.490,50"); // → 349050
parseMoney("3490,5"); // → 349050
parseMoney("1250"); // → 125000
parseMoney("-12,50 TL"); // → -1250
parseMoney("12.500"); // → 1250000
parseMoney("1250.50"); // → null
parseMoney("1,250.50"); // → null
parseMoney("12,345"); // → null
parseMoney(""); // → null
```

- The comma is the decimal separator and a dot is always a thousands
  separator. A dot is accepted only where it closes a complete group of three
  digits, so `"12.500"` is twelve thousand five hundred lira and `"1250.50"`
  is not read at all. The function never guesses.
- At most two digits may follow the comma. One digit is tens of kuruş:
  `"3490,5"` is 3.490,50.
- `TL`, `TRY` (in any letter case) or `₺` may stand before or after the
  amount, once. A sign (`+`, `-` or the minus sign U+2212) may stand before
  the amount or before the currency, once.
- Whitespace is ignored wherever it is, which also reads `"1 250,50"`.
- An amount beyond the safe integer range is `null`. The result is never
  `-0`.
- `parseMoney(formatMoney(amount))` gives `amount` back for every amount
  `formatMoney` accepts, with and without `symbol`.

#### `moneyToWords`

```ts
moneyToWords(kurus: number): string
```

| Parameter | Type     | Default  | Description                                 |
| --------- | -------- | -------- | ------------------------------------------- |
| `kurus`   | `number` | required | The amount in whole kuruş. May be negative. |

**Returns** the amount in Turkish words, the way it is written out on an
invoice or a receipt.

```ts
moneyToWords(349050); // → "üç bin dört yüz doksan Türk lirası elli kuruş"
moneyToWords(100000); // → "bin Türk lirası"
moneyToWords(100000000); // → "bir milyon Türk lirası"
moneyToWords(50); // → "elli kuruş"
moneyToWords(0); // → "sıfır Türk lirası"
moneyToWords(-250075); // → "eksi iki bin beş yüz Türk lirası yetmiş beş kuruş"
```

- Words are separated by single spaces and written in lower case; "Türk
  lirası" keeps its capital. Pass the result through `toUpperCase` or
  `capitalize` if your document needs another style.
- One thousand is "bin" and one hundred is "yüz", never "bir bin" or "bir
  yüz". The larger units keep it: "bir milyon".
- An amount below one lira is read by its kuruş alone ("elli kuruş"); a whole
  number of lira has no kuruş part.
- The largest amount, `Number.MAX_SAFE_INTEGER` kuruş, is in the trillions of
  lira, and "trilyon" is the largest word the function needs.
- The input rules are those of `formatMoney`:

```ts
moneyToWords(0.1 + 0.2); // throws RangeError: moneyToWords: expected a whole number of kuruş within the safe integer range, received 0.30000000000000004
```

### Dates

A date reaches these functions in one of two forms, and they are not the same
thing:

- An **instant**: a `Date` or a timestamp in milliseconds. Which calendar day
  it falls on depends on the time zone, so it is read in `options.timeZone`,
  which defaults to `"Europe/Istanbul"`. The time zone of the machine is never
  used.
- A **calendar date**: a string in the ISO form `"yyyy-MM-dd"`, what an
  `<input type="date">` and a SQL `DATE` column hold. It has no time and no
  time zone; it is written as it stands and `timeZone` is ignored.

#### `formatDate`

```ts
formatDate(date: Date | number | string, options?: TimeZoneOptions): string

type TimeZoneOptions = { timeZone?: string };
```

| Parameter          | Type                       | Default             | Description                                                 |
| ------------------ | -------------------------- | ------------------- | ----------------------------------------------------------- |
| `date`             | `Date \| number \| string` | required            | An instant, or a calendar date as `"yyyy-MM-dd"`.           |
| `options.timeZone` | `string`                   | `"Europe/Istanbul"` | IANA time zone an instant is read in. Ignored for a string. |

**Returns** the date as `dd.MM.yyyy`.

```ts
formatDate("2026-11-10"); // → "10.11.2026"
formatDate(new Date("2026-11-10T21:30:00Z")); // → "11.11.2026"
formatDate(new Date("2026-11-10T21:30:00Z"), { timeZone: "UTC" }); // → "10.11.2026"
formatDate(1794346200000); // → "11.11.2026"
```

- A string must be a real date in the ISO form. Anything else, including a
  date already written with dots and a full ISO date-time, throws a
  `RangeError`:

```ts
formatDate("10.11.2026"); // throws RangeError: formatDate: expected a real calendar date like "2026-11-10", received "10.11.2026"
formatDate("2026-02-30"); // throws RangeError: formatDate: expected a real calendar date like "2026-11-10", received "2026-02-30"
```

- An invalid `Date`, `NaN`, and an instant outside the years 0001 to 9999
  throw a `RangeError`. A value of another type throws a `TypeError`.
- An unknown time zone throws a `RangeError`; it is not replaced by the
  default, because the date would then be silently wrong:

```ts
formatDateTime(0, { timeZone: "Mars/Olympus" }); // throws RangeError: formatDateTime: unknown time zone "Mars/Olympus", expected an IANA name like "Europe/Istanbul"
```

#### `formatDateTime`

```ts
formatDateTime(date: Date | number, options?: TimeZoneOptions): string
```

| Parameter          | Type             | Default             | Description                            |
| ------------------ | ---------------- | ------------------- | -------------------------------------- |
| `date`             | `Date \| number` | required            | An instant.                            |
| `options.timeZone` | `string`         | `"Europe/Istanbul"` | IANA time zone the instant is read in. |

**Returns** the date and the time of day as `dd.MM.yyyy HH:mm`, on the 24-hour
clock.

```ts
formatDateTime(new Date("2026-11-10T11:30:00Z")); // → "10.11.2026 14:30"
formatDateTime(new Date("2026-11-10T11:30:00Z"), { timeZone: "Europe/Berlin" }); // → "10.11.2026 12:30"
formatDateTime(new Date("2026-11-10T21:30:00Z")); // → "11.11.2026 00:30"
formatDateTime(0); // → "01.01.1970 02:00"
```

- Midnight is `00:00`, never `24:00`. Seconds are cut off, not rounded.
- A string is not accepted, because a calendar date has no time of day:

```ts
formatDateTime("2026-11-10"); // throws TypeError: formatDateTime: expected a Date or a timestamp in milliseconds, received string
```

#### `parseDate`

```ts
parseDate(text: string): string | null
```

| Parameter | Type     | Default  | Description                        |
| --------- | -------- | -------- | ---------------------------------- |
| `text`    | `string` | required | A date as it was typed, day first. |

**Returns** the calendar date in the ISO form `"yyyy-MM-dd"`, or `null` when
the text is not a real date written as `dd.MM.yyyy`.

```ts
parseDate("10.11.2026"); // → "2026-11-10"
parseDate("1.2.2026"); // → "2026-02-01"
parseDate("31.02.2026"); // → null
parseDate("29.02.2026"); // → null
parseDate("29.02.2024"); // → "2024-02-29"
parseDate("10/11/2026"); // → null
parseDate("10.11.26"); // → null
```

- The day and the month may have one or two digits, the year has exactly
  four. Whitespace around the date is ignored; whitespace inside it is not.
- A date that does not exist is `null`: the 31st of a 30-day month, the 29th
  of February outside a leap year, month 13, year 0000.
- The result is a string, not a `Date`, on purpose: a calendar date turned
  into a `Date` picks up a time zone and can slide to the day before. Store
  the string, and build a `Date` only where you need an instant.
- The result goes straight back into `formatDate`:

```ts
formatDate(parseDate("5.3.2026") ?? "2000-01-01"); // → "05.03.2026"
```

#### `getMonthName`

```ts
getMonthName(date: Date | number | string, options?: TimeZoneOptions): string
```

| Parameter          | Type                       | Default             | Description                                                 |
| ------------------ | -------------------------- | ------------------- | ----------------------------------------------------------- |
| `date`             | `Date \| number \| string` | required            | An instant, or a calendar date as `"yyyy-MM-dd"`.           |
| `options.timeZone` | `string`                   | `"Europe/Istanbul"` | IANA time zone an instant is read in. Ignored for a string. |

**Returns** the Turkish name of the month the date falls in.

```ts
getMonthName("2026-11-10"); // → "Kasım"
getMonthName(new Date("2026-12-31T22:00:00Z")); // → "Ocak"
getMonthName(new Date("2026-12-31T22:00:00Z"), { timeZone: "UTC" }); // → "Aralık"
```

- Invalid input is handled as in [`formatDate`](#formatdate).

#### `getDayName`

```ts
getDayName(date: Date | number | string, options?: TimeZoneOptions): string
```

| Parameter          | Type                       | Default             | Description                                                 |
| ------------------ | -------------------------- | ------------------- | ----------------------------------------------------------- |
| `date`             | `Date \| number \| string` | required            | An instant, or a calendar date as `"yyyy-MM-dd"`.           |
| `options.timeZone` | `string`                   | `"Europe/Istanbul"` | IANA time zone an instant is read in. Ignored for a string. |

**Returns** the Turkish name of the day of the week the date falls on.

```ts
getDayName("2026-11-10"); // → "Salı"
getDayName(new Date("2026-11-10T21:30:00Z")); // → "Çarşamba"
getDayName(new Date("2026-11-10T21:30:00Z"), { timeZone: "UTC" }); // → "Salı"
```

- Invalid input is handled as in [`formatDate`](#formatdate).

#### `MONTH_NAMES`

```ts
MONTH_NAMES: readonly string[]
```

The twelve month names, January first. The list is frozen.

```ts
MONTH_NAMES; // → ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
MONTH_NAMES[0]; // → "Ocak"
```

- The index is the month number minus one, which is also what
  `Date.prototype.getMonth` returns.

#### `DAY_NAMES`

```ts
DAY_NAMES: readonly string[]
```

The seven day names, **Monday first**, as a Turkish calendar shows them. The
list is frozen.

```ts
DAY_NAMES; // → ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]
DAY_NAMES[0]; // → "Pazartesi"
```

- `Date.prototype.getDay` counts from Sunday. To index this list with it, use
  `DAY_NAMES[(date.getDay() + 6) % 7]`, or call [`getDayName`](#getdayname),
  which also takes care of the time zone.

### Geography

#### `PROVINCES`

```ts
PROVINCES: readonly Province[]

type Province = { readonly code: number; readonly name: string };
```

The 81 provinces in the order of their licence plate codes. The list and its
entries are frozen.

```ts
PROVINCES.length; // → 81
PROVINCES[0]; // → { code: 1, name: "Adana" }
PROVINCES[33]; // → { code: 34, name: "İstanbul" }
PROVINCES[80]; // → { code: 81, name: "Düzce" }

const names = PROVINCES.map((province) => province.name);
names.sort(compareTurkish).slice(0, 4); // → ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı"]
```

- `code` is a number, 1 to 81. Write it as it stands on a plate with
  `String(code).padStart(2, "0")`.
- `name` is the official name in Turkish spelling: "Afyonkarahisar",
  "Kahramanmaraş", "Şanlıurfa", "Mersin".
- The list is in plate order, not in alphabetical order. Sort a copy with
  [`compareTurkish`](#compareturkish) for a select box.

#### `getProvinceByCode`

```ts
getProvinceByCode(code: number | string): Province | null
```

| Parameter | Type               | Default  | Description                                  |
| --------- | ------------------ | -------- | -------------------------------------------- |
| `code`    | `number \| string` | required | The plate code as a number or as its digits. |

**Returns** the province with that plate code, or `null` when there is none.

```ts
getProvinceByCode(34); // → { code: 34, name: "İstanbul" }
getProvinceByCode("06"); // → { code: 6, name: "Ankara" }
getProvinceByCode(82); // → null
getProvinceByCode(6.5); // → null
getProvinceByCode("abc"); // → null
```

- A string may have one or two digits and spaces around them.
- The object returned is the entry of `PROVINCES` itself, so two lookups of
  the same code are `===`.
- A value that is neither a number nor a string throws a `TypeError`.

#### `getProvinceByName`

```ts
getProvinceByName(name: string): Province | null
```

| Parameter | Type     | Default  | Description        |
| --------- | -------- | -------- | ------------------ |
| `name`    | `string` | required | The province name. |

**Returns** the province with that name, or `null`. Letter case, Turkish
letters and spaces around the name do not matter: the name is compared by its
[`foldText`](#foldtext) key.

```ts
getProvinceByName("istanbul"); // → { code: 34, name: "İstanbul" }
getProvinceByName("ISTANBUL"); // → { code: 34, name: "İstanbul" }
getProvinceByName(" şanlıurfa "); // → { code: 63, name: "Şanlıurfa" }
getProvinceByName("Sanliurfa"); // → { code: 63, name: "Şanlıurfa" }
getProvinceByName("Urfa"); // → null
getProvinceByName("İçel"); // → null
```

- Only the current official names are known. Short and former names ("Urfa",
  "Antep", "Maraş", "Afyon", "İçel", "İzmit", "Adapazarı") are `null`.
- It matches whole names only; it is not a search. For a search box, filter
  `PROVINCES` by `foldText(province.name).includes(foldText(query))`.

#### `isValidLicensePlate`

```ts
isValidLicensePlate(value: unknown): boolean
```

| Parameter | Type      | Default  | Description         |
| --------- | --------- | -------- | ------------------- |
| `value`   | `unknown` | required | The plate, as text. |

**Returns** `true` when the value has the shape of a civil licence plate: a
province code from 01 to 81, then one to three letters, then digits, in one of
the six layouts below.

| Layout       | Example      |
| ------------ | ------------ |
| `99 X 9999`  | `06 A 1234`  |
| `99 X 99999` | `06 A 12345` |
| `99 XX 999`  | `35 AB 123`  |
| `99 XX 9999` | `35 AB 1234` |
| `99 XXX 99`  | `01 ABC 12`  |
| `99 XXX 999` | `34 ABC 123` |

```ts
isValidLicensePlate("34 ABC 123"); // → true
isValidLicensePlate("34abc123"); // → true
isValidLicensePlate("06 A 12345"); // → true
isValidLicensePlate("82 ABC 123"); // → false
isValidLicensePlate("34 QWX 123"); // → false
isValidLicensePlate("34 ÇŞ 123"); // → false
isValidLicensePlate("34-ABC-123"); // → false
```

- The spaces between the three parts are optional and letter case does not
  matter. Other separators make the value invalid.
- The letters are the 23 that plates use: no Ç, Ğ, İ, Ö, Ş, Ü and no Q, W, X.
- Only the shape is checked. The digit group may start with zeros, and no
  rule about which letter groups a province hands out is applied.
- Plates outside the civil layouts (official, police, military, diplomatic,
  temporary) are `false`.
- Read the province of a valid plate with
  `getProvinceByCode(plate.trim().slice(0, 2))`.

## Guides

### Validate a customer form and store clean values

Validate what was typed, then store the normalised form, so that the same
customer is not saved twice under two spellings.

```ts
import {
  getPhoneType,
  isValidTckn,
  isValidVkn,
  normalizeIban,
  normalizePhone,
} from "@handijit/tr";

const form = {
  taxId: "1234567890",
  phone: "0 (532) 123 45 67",
  iban: "tr33 0006 1005 1978 6457 8413 26",
};

// A company has a 10-digit tax number, a sole proprietor an 11-digit identity number.
isValidVkn(form.taxId) || isValidTckn(form.taxId); // → true
getPhoneType(form.phone) === "mobile"; // → true

const customer = {
  taxId: form.taxId.replace(/\s/g, ""),
  phone: normalizePhone(form.phone),
  iban: normalizeIban(form.iban),
};
customer.phone; // → "+905321234567"
customer.iban; // → "TR330006100519786457841326"
```

### Add up an invoice without losing a kuruş

Parse each amount once, do the arithmetic on integers, and format at the end.
With floating-point lira `0.1 + 0.2` is `0.30000000000000004`; with kuruş
`10 + 20` is `30`.

```ts
import { formatMoney, moneyToWords, parseMoney } from "@handijit/tr";

const typed = ["1.250,50", "349,90 TL", "0,10"];
const amounts = typed.map((text) => parseMoney(text) ?? 0);
amounts; // → [125050, 34990, 10]

const subtotal = amounts.reduce((sum, amount) => sum + amount, 0);
// Rounding is your decision, taken once, on an integer.
const vat = Math.round((subtotal * 20) / 100);
const total = subtotal + vat;

formatMoney(subtotal); // → "1.600,50 TL"
formatMoney(vat); // → "320,10 TL"
formatMoney(total, { symbol: true }); // → "₺1.920,60"
moneyToWords(total); // → "bin dokuz yüz yirmi Türk lirası altmış kuruş"
```

### Search and sort a customer list

Fold the query once and each name once; sort what is left with
`compareTurkish`.

```ts
import { compareTurkish, foldText } from "@handijit/tr";

const customers = [
  "Şahin Ticaret",
  "Işık Market",
  "İnci Kırtasiye",
  "Çınar Yapı",
];

const query = foldText("ISIK");
customers.filter((name) => foldText(name).includes(query)); // → ["Işık Market"]

[...customers].sort(compareTurkish); // → ["Çınar Yapı", "Işık Market", "İnci Kırtasiye", "Şahin Ticaret"]
```

For a long list, compute `foldText(name)` once when the list loads, not on
every keystroke.

### Keep dates as ISO strings, show them with dots

Store a date of the calendar (an invoice date, a due date) as `"yyyy-MM-dd"`
and a moment in time (when a record was created) as a timestamp. Format both
for the screen.

```ts
import {
  formatDate,
  formatDateTime,
  getDayName,
  parseDate,
} from "@handijit/tr";

const dueDate = parseDate("15.12.2026");
dueDate; // → "2026-12-15"

const createdAt = Date.UTC(2026, 10, 10, 21, 30);
formatDateTime(createdAt); // → "11.11.2026 00:30"
formatDate(createdAt); // → "11.11.2026"
getDayName(createdAt); // → "Çarşamba"
```

The last three lines say "11 November" although the instant is still 10
November in UTC: in Istanbul it is already past midnight. This is the reason
the time zone is a parameter with a fixed default and is not taken from the
machine.

### Fill a province select and read a plate

```ts
import {
  compareTurkish,
  getProvinceByCode,
  isValidLicensePlate,
  PROVINCES,
} from "@handijit/tr";

const options = [...PROVINCES].sort((a, b) => compareTurkish(a.name, b.name));
options[0]; // → { code: 1, name: "Adana" }
options[80]; // → { code: 67, name: "Zonguldak" }

const plate = "35 AB 1234";
isValidLicensePlate(plate); // → true
getProvinceByCode(plate.slice(0, 2)); // → { code: 35, name: "İzmir" }
```

## Server-side rendering and Electron

- **No hydration mismatch.** A server in Frankfurt with a minimal Node image
  and a browser in İzmir produce the same text, because nothing reads the
  locale or the time zone of the machine. `formatDate(order.createdAt)` in a
  Next.js Server Component and in a Client Component give the same string.
- **No environment check is needed.** The package touches neither `window`
  nor `process`, so it can be imported in a Server Component, a Client
  Component, an Edge runtime, a Web Worker, and in both the main and the
  renderer process of an Electron application.
- **`Date` objects from another realm work.** A `Date` that crossed an
  `iframe` or an Electron context boundary fails `instanceof Date`; the date
  functions read it all the same.
- **Nothing happens at import time.** No lookup table is built and no
  formatter is created until a function that needs it is called.

## Semantics

| Input                                                                | `isValid…`     | Read what a person typed (`parseMoney`, `parseDate`, `normalize…`, `formatIban`, `formatPhone`, `getPhoneType`, `getProvinceBy…`) | Write a value of the program (`formatMoney`, `moneyToWords`, `formatDate`, `formatDateTime`, `getMonthName`, `getDayName`, text functions) |
| -------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| A value of the wrong type (`null`, `undefined`, a number for a text) | `false`        | throws `TypeError`                                                                                                                | throws `TypeError`                                                                                                                         |
| Text or a number that is well typed but not valid                    | `false`        | `null`                                                                                                                            | throws `RangeError`                                                                                                                        |
| Empty string                                                         | `false`        | `null`                                                                                                                            | text functions return `""`; date functions throw `RangeError`                                                                              |
| Whitespace around the value                                          | ignored        | ignored                                                                                                                           | kept (text functions)                                                                                                                      |
| An option outside its documented values (`style`, `symbol`)          | not applicable | the default is used                                                                                                               | the default is used                                                                                                                        |
| An unknown `timeZone`                                                | not applicable | not applicable                                                                                                                    | throws `RangeError`                                                                                                                        |

More precisely:

| Case                                          | Result                                                                     |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| Whitespace inside a TCKN, VKN, IBAN or amount | ignored                                                                    |
| Whitespace inside a date (`"10. 11. 2026"`)   | `null`                                                                     |
| Kuruş with a fraction, `NaN`, `±Infinity`     | `RangeError`                                                               |
| Kuruş beyond `Number.MAX_SAFE_INTEGER`        | `RangeError` when formatting, `null` when parsing                          |
| `-0` kuruş                                    | formatted as zero, never produced by `parseMoney`                          |
| `bigint` kuruş                                | `TypeError`                                                                |
| An invalid `Date`, a `NaN` timestamp          | `RangeError`                                                               |
| An instant outside the years 0001 to 9999     | `RangeError`                                                               |
| A `Date` from another realm                   | accepted                                                                   |
| An object that only looks like a `Date`       | `TypeError`                                                                |
| A boxed string (`new String("x")`)            | `false` from `isValid…`, `TypeError` elsewhere                             |
| Text in decomposed Unicode form (NFD)         | `compareTurkish`, `foldText` and `toLowerCase` read it as the same letters |

Error messages start with the name of the function and say what was expected
and what arrived, without echoing the value of a wrong type:

```ts
toUpperCase(34); // throws TypeError: toUpperCase: expected a string, received number
getProvinceByCode(null); // throws TypeError: getProvinceByCode: expected a plate code as a number or a string, received null
formatDate(new Date(Number.NaN)); // throws RangeError: formatDate: received an invalid date
```

## Performance

`npm run bench` measures the built package (`build/index.mjs`), after three
warm-up rounds, for a fixed number of calls. The table is the output of that
script on the machine named in its first line; expect other absolute numbers
on yours.

Node v26.11.0 · Apple M5 · darwin/arm64

| Scenario                               | Iterations | Total (ms) |  µs/op |
| -------------------------------------- | ---------: | ---------: | -----: |
| toUpperCase: 15 characters             |  1,000,000 |       85.8 |  0.086 |
| toUpperCase: 10 000 characters         |      2,000 |       68.2 | 34.113 |
| toTitleCase: 15 characters             |  1,000,000 |      291.0 |  0.291 |
| foldText: 15 characters                |  1,000,000 |      213.5 |  0.213 |
| foldText: 10 000 characters            |      2,000 |       92.7 | 46.343 |
| slugify: 15 characters                 |  1,000,000 |      304.1 |  0.304 |
| compareTurkish: two province names     |  1,000,000 |      298.1 |  0.298 |
| compareTurkish: sort 81 province names |     10,000 |      934.1 | 93.407 |
| isValidTckn: valid                     |  1,000,000 |       38.3 |  0.038 |
| isValidVkn: valid                      |  1,000,000 |       84.2 |  0.084 |
| isValidIban: valid, with spaces        |  1,000,000 |      229.3 |  0.229 |
| formatIban: compact input              |  1,000,000 |      338.9 |  0.339 |
| normalizePhone: 0 (532) 123 45 67      |  1,000,000 |      103.3 |  0.103 |
| formatPhone: +905321234567             |  1,000,000 |       98.4 |  0.098 |
| formatMoney: 349050                    |  1,000,000 |       26.9 |  0.027 |
| formatMoney: largest safe amount       |  1,000,000 |       49.3 |  0.049 |
| parseMoney: 3.490,50 TL                |  1,000,000 |      106.7 |  0.107 |
| moneyToWords: 349050                   |  1,000,000 |      209.9 |  0.210 |
| moneyToWords: largest safe amount      |  1,000,000 |      549.6 |  0.550 |
| formatDate: calendar date string       |  1,000,000 |       83.4 |  0.083 |
| formatDate: instant                    |    200,000 |      274.0 |  1.370 |
| formatDateTime: instant                |    200,000 |      280.7 |  1.403 |
| getDayName: instant                    |    200,000 |      288.1 |  1.441 |
| parseDate: 10.11.2026                  |  1,000,000 |       87.7 |  0.088 |
| getProvinceByCode: 34                  |  1,000,000 |        3.8 |  0.004 |
| getProvinceByName: İstanbul            |  1,000,000 |      125.1 |  0.125 |
| isValidLicensePlate: 34 ABC 123        |  1,000,000 |       15.1 |  0.015 |

Cold start, measured once in a fresh process: first formatDateTime 6.83 ms, first getProvinceByName 0.14 ms.

- The text functions grow linearly with the length of the text.
- The first call of a date function with a given time zone builds an
  `Intl.DateTimeFormat`; later calls reuse it. Formatters are kept for the 8
  most recently introduced time zones.
- A calendar date string never reaches `Intl`, which is why it is formatted
  an order of magnitude faster than an instant.
- `getProvinceByName` builds its 81-entry lookup on the first call.

## Bundle size

`npm run size` prints this table from the build output and fails when the
minified bundle grows beyond its gzip budget of 5000 B.

| File                 | Raw      | Gzip     | Brotli  |
| -------------------- | -------- | -------- | ------- |
| `build/index.mjs`    | 29.05 kB | 10.02 kB | 8.65 kB |
| `build/index.cjs`    | 29.73 kB | 10.11 kB | 8.73 kB |
| `build/index.umd.js` | 9.44 kB  | 4.36 kB  | 3.96 kB |
| `build/index.d.ts`   | 6.68 kB  | 2.37 kB  | 2.01 kB |

The table was produced on Node 26. The gzip column depends on the zlib that
Node bundles and differs by a percent or so between Node versions; the raw
sizes do not.

The ESM and CommonJS files are not minified, so that a stack trace in your
application points at readable code; your bundler minifies them with the rest
of your code and drops the functions you do not import.

| Consumer             | Entry point                                                        | How it is chosen                                        |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| ESM (`import`)       | `build/index.mjs`                                                  | `exports["."].import`, `module`                         |
| CommonJS (`require`) | `build/index.cjs`                                                  | `exports["."].require`, `main`                          |
| `<script>` and CDNs  | `build/index.umd.js`                                               | `unpkg`, `jsdelivr`; global `handijitTr`                |
| TypeScript           | `build/index.d.mts` for `import`, `build/index.d.ts` for `require` | the `types` condition of each branch, top-level `types` |

```html
<script src="https://unpkg.com/@handijit/tr"></script>
<script>
  handijitTr.formatMoney(349050);
</script>
```

Source maps are published next to every JavaScript file.

## TypeScript

The declarations ship with the package; there is no `@types` package to
install. Five types are exported next to the functions:

```ts
import type {
  FormatMoneyOptions,
  FormatPhoneOptions,
  PhoneType,
  Province,
  TimeZoneOptions,
} from "@handijit/tr";
```

- The `isValid…` functions take `unknown`, so a value from a form library or
  from `JSON.parse` needs no cast. They return `boolean`, not a type
  predicate: a valid TCKN is still just a `string`.
- Functions that can fail on what a person typed return `T | null`, never
  `undefined`, so `??` and a strict null check both work on the result.
- `PROVINCES`, `MONTH_NAMES` and `DAY_NAMES` are `readonly` in the types and
  frozen at run time. Copy before you sort: `[...PROVINCES].sort(…)`.
- With `noUncheckedIndexedAccess`, `MONTH_NAMES[0]` is `string | undefined`.
  `getMonthName` and `getDayName` return a plain `string`.
- The declarations resolve under `node10`, `node16` and `bundler` module
  resolution, for `import` and for `require`: the package ships the same
  declarations twice, as `index.d.mts` and as `index.d.ts`, and
  `npm run verify` checks the result with `attw`.

## FAQ and troubleshooting

**Why not `toLocaleUpperCase("tr-TR")`, `Intl.Collator` and
`Intl.NumberFormat`?**
They are correct where the runtime has Turkish locale data, and silently fall
back to another locale where it does not (a Node build with reduced ICU
data, some embedded and edge runtimes). Their output also comes from the
locale data of the runtime, which is not the same in every engine and every
version, so a snapshot test or a server-rendered page can differ from what
the browser prints. This package gives you one fixed, documented output.

**Is a number that passes `isValidTckn` a real identity number?**
No. It has correct check digits, which catches typing mistakes. Whether it
belongs to a person can only be answered by the population registry.

**`parseMoney("1250.50")` is `null`. Why?**
In Turkish notation the dot separates thousands and the comma separates
kuruş. `1250.50` is English notation; reading it would mean guessing, and
`"12.500"` shows how badly a guess can go. If your input is a JavaScript
number literal, you do not need a parser: `Math.round(Number(text) * 100)`.

**`formatMoney(12.5)` throws. Why does it not round?**
Because 12.5 kuruş is a bug upstream, in a division or a percentage. Decide
how to round where the fraction is created, then pass the integer.

**The date is one day off.**
You are probably formatting an instant and expecting the calendar day of
another time zone. An instant is read in `"Europe/Istanbul"` unless you pass
`timeZone`. If the value is a date without a time (a birthday, a due date),
keep it as `"yyyy-MM-dd"` and pass the string: it is never shifted.

**`formatDate("2026-11-10T21:30:00Z")` throws.**
A string is taken as a calendar date and must be exactly `"yyyy-MM-dd"`. For
an ISO date-time, pass `new Date(text)`.

**`getProvinceByName("Urfa")` is `null`.**
Only the 81 official names are matched. Map the short names you want to
accept in your own code.

**My phone number is valid but `isValidPhone` says `false`.**
Short numbers such as `444 0 123`, emergency numbers and numbers of other
countries are outside what this function accepts. It accepts ten-digit
national numbers that start with 2, 3, 4, 5 or 8.

### Known limitations

- `toLowerCase`: for "I" followed by a combining mark other than the dot
  above and then by U+0307, `toLocaleLowerCase("tr-TR")` removes the U+0307
  and keeps "i"; this function gives "ı" and keeps the marks. For every
  single code point of Unicode, `toUpperCase` and `toLowerCase` match the
  `tr-TR` mappings of the runtime the tests run on.
- `toTitleCase` has no list of small words and no list of abbreviations.
- `compareTurkish` is not a natural sort and not a full Unicode collation.
- `isValidIban` is for Turkish IBANs only and does not look up the bank code.
- `isValidPhone` does not know which area codes and operator prefixes are in
  use.
- `isValidLicensePlate` knows the six civil layouts only.
- `getProvinceByName` knows no short or former names.
- The date functions cover the years 0001 to 9999 and the proleptic Gregorian
  calendar.

## Breaking changes

None. 1.0.0 is the first release. From here on, any change in what a function
returns for an input that was already accepted, including the correction of a
wrong answer, is released as a new major version and listed here in a table
of old and new behaviour.

## Contributing

```bash
npm install
npm run verify   # lint → typecheck → test → build → size → lint:package
npm run bench    # after a build; prints the table in "Performance"
```

- `npm test` runs 1200 tests in 44 files, in Node and
  in jsdom, and fails below 100% statement, branch, function or line coverage.
- Every module and helper under `lib/` has a test file of the same name
  under `__tests__/`.
- Identity numbers, tax numbers and IBANs in the tests are generated from
  made-up digits by the helpers in `__tests__/support/`. Do not add a number
  that belongs to a person or a company.
- A new export goes into `lib/index.ts`, `__tests__/index.test.ts`,
  `__tests__/types.test.ts`, this file and `CHANGELOG.md`.

## Releasing

1. Move the entries under `Unreleased` in `CHANGELOG.md` to a section for the
   new version.
2. `npm version patch|minor|major`.
3. Push to `master`.

The `Publish to npm` workflow then checks whether that version is on npm. If
it is not, it runs every check of `npm run verify`, installs the packed
tarball into an empty project and runs it as ESM and as CommonJS, publishes
with the `NPM_ACCESS_TOKEN` secret and a signed provenance statement, pushes
the annotated tag `v<version>` and creates the GitHub Release from the
CHANGELOG section. A push that does not change the version publishes nothing
and is not a failure.

While the package is not on npm at all, the workflow runs all the checks,
publishes nothing and says so in its summary: the first version is published
by a maintainer with `npm publish --access public`.

## License

[MIT](./LICENSE) © Han Dijit
