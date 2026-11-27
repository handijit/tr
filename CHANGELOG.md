# Changelog

All notable changes to this package are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the package follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-11-27

First release. Written from scratch; it does not share code or API with the
unpublished `@handijit/tr`.

### Added

- Text: `slugify`, `foldTurkish`, `toLowerTr`, `toUpperTr`, `compareTr`.
- Money in integer kuruş: `parseLira`, `formatLira`, `liraInWords`.
- VAT: `addVat`, `removeVat`, `vatOf` (bigint arithmetic, half away from zero).
- Validators and formatters: `isTckn`, `isVkn`, `isIban`, `formatIban`,
  `normalizePhone`, `isMobilePhone`, `formatPhone`.
- Dates: `formatDateTr`, `parseDateTr` (`dd.MM.yyyy`, Türkiye time).
- Provinces: `PROVINCES` (81 entries with plate codes), `provinceByPlate`.
- Types: `Kurus`, `Province`, `SlugifyOptions`, `FormatLiraOptions`,
  `VatOfOptions`.

[Unreleased]: https://github.com/handijit/tr/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/handijit/tr/releases/tag/v1.0.0
