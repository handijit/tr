# Changelog

All notable changes to this package are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the package follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-11-10

First public release.

### Added

- **Text:** `toUpperCase`, `toLowerCase`, `capitalize` and `toTitleCase` with
  the Turkish rule for "i" and "ı", independent of the locale data of the
  runtime; `compareTurkish`, a comparator for `Array.prototype.sort` in Turkish
  alphabetical order; `foldText`, a key for case-insensitive and
  accent-insensitive search; `slugify`.
- **Identity and bank numbers:** `isValidTckn` (T.C. identity number),
  `isValidVkn` (tax identification number) and `isValidIban` (Turkish IBAN,
  ISO 13616 checksum); `normalizeIban` for storage and `formatIban` for
  reading.
- **Phone numbers:** `isValidPhone`, `getPhoneType` (`"mobile"`, `"landline"`
  or `"nonGeographic"`), `normalizePhone` (E.164) and `formatPhone` with a
  national and an international style.
- **Money:** `formatMoney` (whole kuruş to `3.490,50 TL` or `₺3.490,50`,
  without `Intl`), `parseMoney` (Turkish notation to whole kuruş) and
  `moneyToWords` (the amount written out in Turkish). No function does
  floating-point arithmetic on an amount.
- **Dates:** `formatDate` (`dd.MM.yyyy`) and `formatDateTime`
  (`dd.MM.yyyy HH:mm`) with a `timeZone` option that defaults to
  `Europe/Istanbul`; `parseDate`, which reads `dd.MM.yyyy` into an ISO
  `yyyy-MM-dd` string and rejects dates that do not exist; `getMonthName`,
  `getDayName`, `MONTH_NAMES` and `DAY_NAMES`.
- **Geography:** `PROVINCES` (the 81 provinces with their plate codes),
  `getProvinceByCode`, `getProvinceByName` and `isValidLicensePlate` (the six
  civil plate layouts).
- **Types:** `FormatMoneyOptions`, `FormatPhoneOptions`, `PhoneType`,
  `Province` and `TimeZoneOptions`.
- ESM, CommonJS and minified UMD builds with source maps and TypeScript
  declarations; zero runtime dependencies; `"sideEffects": false`.

[Unreleased]: https://github.com/handijit/tr/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/handijit/tr/releases/tag/v1.0.0
