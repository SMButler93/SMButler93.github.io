/** A calendar month in ISO `YYYY-MM` form, e.g. `2023-09`. */
export type YearMonth = `${number}-${string}`;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

interface ParsedYearMonth {
  readonly year: number;
  /** 1–12 */
  readonly month: number;
}

export function parseYearMonth(value: YearMonth): ParsedYearMonth {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  const year = Number(match?.[1]);
  const month = Number(match?.[2]);
  if (!match || month < 1 || month > 12) {
    throw new RangeError(`Invalid YYYY-MM value: "${value}"`);
  }
  return { year, month };
}

/** `2023-09` → `Sep 2023`. Locale-independent so output is identical at build time and in the browser. */
export function formatYearMonth(value: YearMonth): string {
  const { year, month } = parseYearMonth(value);
  return `${MONTHS[month - 1]} ${year}`;
}

/** Whole months from `start` up to and including the month of `now`. */
export function monthsInclusive(start: YearMonth, now: Date = new Date()): number {
  const { year, month } = parseYearMonth(start);
  const elapsed = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month) + 1;
  return Math.max(elapsed, 0);
}

const plural = (count: number, unit: string): string => `${count} ${unit}${count === 1 ? '' : 's'}`;

/** `38` → `3 yrs 2 mos`. */
export function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts = [years > 0 ? plural(years, 'yr') : '', months > 0 ? plural(months, 'mo') : ''];
  return parts.filter(Boolean).join(' ') || 'Less than a month';
}

export function formatTenure(start: YearMonth, now: Date = new Date()): string {
  return formatDuration(monthsInclusive(start, now));
}
