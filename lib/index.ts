// lib/index.ts holds no logic; the list below IS the public contract.
import capitalize from "./modules/capitalize";
import compareTurkish from "./modules/compare-turkish";
import DAY_NAMES from "./modules/day-names";
import foldText from "./modules/fold-text";
import formatDate from "./modules/format-date";
import formatDateTime from "./modules/format-date-time";
import formatIban from "./modules/format-iban";
import formatMoney from "./modules/format-money";
import type { FormatMoneyOptions } from "./modules/format-money";
import formatPhone from "./modules/format-phone";
import type { FormatPhoneOptions } from "./modules/format-phone";
import getDayName from "./modules/get-day-name";
import getMonthName from "./modules/get-month-name";
import getPhoneType from "./modules/get-phone-type";
import getProvinceByCode from "./modules/get-province-by-code";
import getProvinceByName from "./modules/get-province-by-name";
import isValidIban from "./modules/is-valid-iban";
import isValidLicensePlate from "./modules/is-valid-license-plate";
import isValidPhone from "./modules/is-valid-phone";
import isValidTckn from "./modules/is-valid-tckn";
import isValidVkn from "./modules/is-valid-vkn";
import moneyToWords from "./modules/money-to-words";
import MONTH_NAMES from "./modules/month-names";
import normalizeIban from "./modules/normalize-iban";
import normalizePhone from "./modules/normalize-phone";
import parseDate from "./modules/parse-date";
import parseMoney from "./modules/parse-money";
import PROVINCES from "./modules/provinces";
import slugify from "./modules/slugify";
import toLowerCase from "./modules/to-lower-case";
import toTitleCase from "./modules/to-title-case";
import toUpperCase from "./modules/to-upper-case";
import type { PhoneType, Province, TimeZoneOptions } from "./types";

export {
  capitalize,
  compareTurkish,
  DAY_NAMES,
  foldText,
  formatDate,
  formatDateTime,
  formatIban,
  formatMoney,
  formatPhone,
  getDayName,
  getMonthName,
  getPhoneType,
  getProvinceByCode,
  getProvinceByName,
  isValidIban,
  isValidLicensePlate,
  isValidPhone,
  isValidTckn,
  isValidVkn,
  moneyToWords,
  MONTH_NAMES,
  normalizeIban,
  normalizePhone,
  parseDate,
  parseMoney,
  PROVINCES,
  slugify,
  toLowerCase,
  toTitleCase,
  toUpperCase,
};
export type {
  FormatMoneyOptions,
  FormatPhoneOptions,
  PhoneType,
  Province,
  TimeZoneOptions,
};
