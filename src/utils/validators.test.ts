import { describe, it, expect } from 'vitest';
import {
  isValidDate,
  isNonEmptyString,
  hasMinLength,
  hasMaxLength,
  isValidEmail,
  isEndDateAfterStartDate,
  isPositive,
  isValidId,
} from './validators';

describe('Validators', () => {
  describe('isValidDate', () => {
    it('returns true for valid dates', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2026-10-21'))).toBe(true);
    });

    it('returns false for invalid dates', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate(NaN as any)).toBe(false);
    });

    it('returns false for non-Date objects', () => {
      expect(isValidDate('2026-10-21' as any)).toBe(false);
      expect(isValidDate(null as any)).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('returns true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString('  text  ')).toBe(true);
    });

    it('returns false for empty strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
    });

    it('returns false for non-strings', () => {
      expect(isNonEmptyString(123 as any)).toBe(false);
      expect(isNonEmptyString(null as any)).toBe(false);
    });
  });

  describe('hasMinLength', () => {
    it('returns true for strings with sufficient length', () => {
      expect(hasMinLength('hello', 3)).toBe(true);
      expect(hasMinLength('hello', 5)).toBe(true);
    });

    it('returns false for strings below minimum length', () => {
      expect(hasMinLength('hi', 3)).toBe(false);
      expect(hasMinLength('', 1)).toBe(false);
    });
  });

  describe('hasMaxLength', () => {
    it('returns true for strings within maximum length', () => {
      expect(hasMaxLength('hi', 5)).toBe(true);
      expect(hasMaxLength('hello', 5)).toBe(true);
    });

    it('returns false for strings exceeding maximum length', () => {
      expect(hasMaxLength('hello world', 5)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('returns true for valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.email+tag@domain.co.uk')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isEndDateAfterStartDate', () => {
    it('returns true when end date is after start date', () => {
      const start = new Date('2026-01-01');
      const end = new Date('2026-12-31');
      expect(isEndDateAfterStartDate(start, end)).toBe(true);
    });

    it('returns false when end date is before start date', () => {
      const start = new Date('2026-12-31');
      const end = new Date('2026-01-01');
      expect(isEndDateAfterStartDate(start, end)).toBe(false);
    });

    it('returns false when dates are equal', () => {
      const date = new Date('2026-06-15');
      expect(isEndDateAfterStartDate(date, date)).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('returns true for positive numbers', () => {
      expect(isPositive(1)).toBe(true);
      expect(isPositive(0.1)).toBe(true);
      expect(isPositive(999)).toBe(true);
    });

    it('returns false for zero and negative numbers', () => {
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-1)).toBe(false);
      expect(isPositive(-999.99)).toBe(false);
    });
  });

  describe('isValidId', () => {
    it('returns true for non-empty strings', () => {
      expect(isValidId('123')).toBe(true);
      expect(isValidId('user-id-abc')).toBe(true);
    });

    it('returns false for empty strings', () => {
      expect(isValidId('')).toBe(false);
      expect(isValidId('   ')).toBe(false);
    });
  });
});
