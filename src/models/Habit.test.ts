import { describe, it, expect } from 'vitest';
import { Habit } from './Habit';

describe('Habit Model', () => {
  const now = Date.now();

  describe('Constructor', () => {
    it('creates a habit', () => {
      const habit = new Habit('1', 'Exercise', now, now, now);
      expect(habit.id).toBe('1');
      expect(habit.name).toBe('Exercise');
      expect(habit.active).toBe(true);
    });
  });

  describe('activate', () => {
    it('activates a habit', () => {
      const habit = new Habit('1', 'Exercise', now, now, now, [], false);
      habit.activate();
      expect(habit.active).toBe(true);
    });
  });

  describe('deactivate', () => {
    it('deactivates a habit', () => {
      const habit = new Habit('1', 'Exercise', now, now, now);
      habit.deactivate();
      expect(habit.active).toBe(false);
    });
  });

  describe('getDaysSinceStart', () => {
    it('calculates days correctly', () => {
      const oneDayAgo = now - 86400000;
      const habit = new Habit('1', 'Exercise', oneDayAgo, now, now);
      expect(habit.getDaysSinceStart()).toBe(1);
    });

    it('returns 0 for today', () => {
      const habit = new Habit('1', 'Exercise', now, now, now);
      expect(habit.getDaysSinceStart()).toBe(0);
    });
  });

  describe('hasMinimumDays', () => {
    it('returns true when habit meets minimum days', () => {
      const sevenDaysAgo = now - (7 * 86400000);
      const habit = new Habit('1', 'Exercise', sevenDaysAgo, now, now);
      expect(habit.hasMinimumDays(7)).toBe(true);
    });

    it('returns false when habit does not meet minimum days', () => {
      const twoDaysAgo = now - (2 * 86400000);
      const habit = new Habit('1', 'Exercise', twoDaysAgo, now, now);
      expect(habit.hasMinimumDays(7)).toBe(false);
    });
  });

  describe('getAgeFormatted', () => {
    it('returns "Hoy" for today', () => {
      const habit = new Habit('1', 'Exercise', now, now, now);
      expect(habit.getAgeFormatted()).toBe('Hoy');
    });

    it('returns days for recent habits', () => {
      const twoDaysAgo = now - (2 * 86400000);
      const habit = new Habit('1', 'Exercise', twoDaysAgo, now, now);
      expect(habit.getAgeFormatted()).toBe('2 días');
    });

    it('returns weeks format', () => {
      const twoWeeksAgo = now - (14 * 86400000);
      const habit = new Habit('1', 'Exercise', twoWeeksAgo, now, now);
      expect(habit.getAgeFormatted()).toContain('semana');
    });

    it('returns months format', () => {
      const twoMonthsAgo = now - (60 * 86400000);
      const habit = new Habit('1', 'Exercise', twoMonthsAgo, now, now);
      expect(habit.getAgeFormatted()).toContain('mes');
    });
  });
});
