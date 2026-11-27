// The list below IS the public contract; this file holds no logic.
import addVat from "./modules/add-vat";
import compareTr from "./modules/compare-tr";
import foldTurkish from "./modules/fold-turkish";
import formatDateTr from "./modules/format-date-tr";
import formatIban from "./modules/format-iban";
import formatLira from "./modules/format-lira";
import type { FormatLiraOptions } from "./modules/format-lira";
import formatPhone from "./modules/format-phone";
import isIban from "./modules/is-iban";
import isMobilePhone from "./modules/is-mobile-phone";
import isTckn from "./modules/is-tckn";
import isVkn from "./modules/is-vkn";
import liraInWords from "./modules/lira-in-words";
import normalizePhone from "./modules/normalize-phone";
import parseDateTr from "./modules/parse-date-tr";
import parseLira from "./modules/parse-lira";
import provinceByPlate from "./modules/province-by-plate";
import PROVINCES from "./modules/provinces";
import removeVat from "./modules/remove-vat";
import slugify from "./modules/slugify";
import type { SlugifyOptions } from "./modules/slugify";
import toLowerTr from "./modules/to-lower-tr";
import toUpperTr from "./modules/to-upper-tr";
import vatOf from "./modules/vat-of";
import type { VatOfOptions } from "./modules/vat-of";
import type { Kurus, Province } from "./types";

export {
  addVat,
  compareTr,
  foldTurkish,
  formatDateTr,
  formatIban,
  formatLira,
  formatPhone,
  isIban,
  isMobilePhone,
  isTckn,
  isVkn,
  liraInWords,
  normalizePhone,
  parseDateTr,
  parseLira,
  provinceByPlate,
  PROVINCES,
  removeVat,
  slugify,
  toLowerTr,
  toUpperTr,
  vatOf,
};
export type {
  FormatLiraOptions,
  Kurus,
  Province,
  SlugifyOptions,
  VatOfOptions,
};
