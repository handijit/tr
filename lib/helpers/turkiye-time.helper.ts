/**
 * Türkiye has stayed on UTC+03:00 all year since September 2016. A fixed offset makes a date read
 * the same on a UTC server and in the browser (no hydration mismatch) without time-zone data.
 */
const TURKIYE_OFFSET_MS = 3 * 60 * 60 * 1000;

export { TURKIYE_OFFSET_MS };
