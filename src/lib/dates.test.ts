import { describe, expect, it } from 'vitest';
import {
  formatDuration,
  formatTenure,
  formatYearMonth,
  monthsInclusive,
  parseYearMonth,
} from './dates';

describe('parseYearMonth', () => {
  it('parses a valid value', () => {
    expect(parseYearMonth('2023-09')).toEqual({ year: 2023, month: 9 });
  });

  it.each(['2023-13', '2023-00', '23-09', '2023-9'] as const)('rejects %s', (value) => {
    expect(() => parseYearMonth(value)).toThrow(RangeError);
  });
});

describe('formatYearMonth', () => {
  it('uses short English month names regardless of locale', () => {
    expect(formatYearMonth('2023-09')).toBe('Sep 2023');
    expect(formatYearMonth('2026-07')).toBe('Jul 2026');
  });
});

describe('monthsInclusive', () => {
  it('counts the start and current month', () => {
    expect(monthsInclusive('2023-09', new Date(2023, 8, 15))).toBe(1);
    expect(monthsInclusive('2023-09', new Date(2026, 9, 8))).toBe(38);
  });

  it('never returns a negative value', () => {
    expect(monthsInclusive('2030-01', new Date(2026, 0, 1))).toBe(0);
  });
});

describe('formatDuration', () => {
  it.each([
    [0, 'Less than a month'],
    [1, '1 mo'],
    [11, '11 mos'],
    [12, '1 yr'],
    [38, '3 yrs 2 mos'],
  ])('formats %i months as "%s"', (months, expected) => {
    expect(formatDuration(months)).toBe(expected);
  });
});

describe('formatTenure', () => {
  it('combines counting and formatting', () => {
    expect(formatTenure('2023-09', new Date(2026, 9, 8))).toBe('3 yrs 2 mos');
  });
});
