/** One of the 81 provinces of Turkey. */
type Province = {
  /** Licence plate code, 1 to 81. */
  readonly code: number;
  /** Official name in Turkish spelling, such as "İstanbul". */
  readonly name: string;
};

/** What a Turkish phone number is, decided by the first digit of its national number. */
type PhoneType = "mobile" | "landline" | "nonGeographic";

/** Option shared by every function that reads a calendar date off an instant. */
type TimeZoneOptions = {
  /** IANA time zone the instant is read in. Defaults to "Europe/Istanbul". */
  timeZone?: string;
};

export type { PhoneType, Province, TimeZoneOptions };
