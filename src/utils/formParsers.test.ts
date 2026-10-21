import { describe, it, expect } from 'vitest';
import { parseDate, parseTime, formatDate } from './formParsers';

describe('parseDate', () => {
  it('parses a valid DD/MM/YYYY date', () => {
    const ts = parseDate('21/10/2026');
    expect(ts).toBe(new Date(2026, 9, 21).getTime());
  });
  it('accepts single-digit day and month', () => {
    expect(parseDate('1/2/2026')).toBe(new Date(2026, 1, 1).getTime());
  });
  it('rejects impossible dates', () => {
    expect(parseDate('31/02/2026')).toBeNull();
    expect(parseDate('00/01/2026')).toBeNull();
    expect(parseDate('10/13/2026')).toBeNull();
  });
  it('rejects wrong formats', () => {
    expect(parseDate('2026-10-21')).toBeNull();
    expect(parseDate('')).toBeNull();
    expect(parseDate('abc')).toBeNull();
  });
});

describe('parseTime', () => {
  it('normalizes valid times', () => {
    expect(parseTime('9:05')).toBe('09:05');
    expect(parseTime('23:59')).toBe('23:59');
  });
  it('rejects invalid times', () => {
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('10:60')).toBeNull();
    expect(parseTime('1000')).toBeNull();
    expect(parseTime('')).toBeNull();
  });
});

describe('formatDate', () => {
  it('round-trips with parseDate', () => {
    const ts = parseDate('05/03/2026')!;
    expect(formatDate(ts)).toBe('05/03/2026');
  });
});
