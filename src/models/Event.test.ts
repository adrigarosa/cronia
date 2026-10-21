import { describe, it, expect } from 'vitest';
import { Event } from './Event';

describe('Event Model', () => {
  const now = Date.now();
  const tomorrow = now + 86400000;

  describe('Constructor', () => {
    it('creates an event', () => {
      const event = new Event('1', 'Meeting', tomorrow, '10:00', tomorrow, '11:00', now, now);
      expect(event.id).toBe('1');
      expect(event.description).toBe('Meeting');
      expect(event.status).toBe('upcoming');
    });

    it('creates event with location', () => {
      const event = new Event('1', 'Meeting', tomorrow, '10:00', tomorrow, '11:00', now, now, [], 'upcoming', 'Office');
      expect(event.location).toBe('Office');
    });
  });

  describe('isUpcoming', () => {
    it('returns true for future events', () => {
      const event = new Event('1', 'Event', tomorrow, '10:00', tomorrow, '11:00', now, now);
      expect(event.isUpcoming()).toBe(true);
    });

    it('returns false for past events', () => {
      const pastDate = now - 86400000;
      const event = new Event('1', 'Event', pastDate, '10:00', pastDate, '11:00', now, now);
      expect(event.isUpcoming()).toBe(false);
    });
  });

  describe('isInProgress', () => {
    it('returns true for current events', () => {
      const startDate = now - 3600000;
      const endDate = now + 3600000;
      const event = new Event('1', 'Event', startDate, '09:00', endDate, '11:00', now, now);
      expect(event.isInProgress()).toBe(true);
    });
  });

  describe('isPast', () => {
    it('returns true for past events', () => {
      const pastDate = now - 86400000;
      const event = new Event('1', 'Event', pastDate, '10:00', pastDate, '11:00', now, now);
      expect(event.isPast()).toBe(true);
    });
  });

  describe('getDurationMinutes', () => {
    it('calculates duration correctly', () => {
      const event = new Event('1', 'Event', tomorrow, '10:00', tomorrow, '11:00', now, now);
      expect(event.getDurationMinutes()).toBe(60);
    });

    it('handles multi-hour events', () => {
      const event = new Event('1', 'Event', tomorrow, '09:00', tomorrow, '14:30', now, now);
      expect(event.getDurationMinutes()).toBe(330); // 5.5 hours
    });
  });

  describe('markCompleted', () => {
    it('marks event as completed', () => {
      const event = new Event('1', 'Event', tomorrow, '10:00', tomorrow, '11:00', now, now);
      event.markCompleted();
      expect(event.status).toBe('completed');
    });
  });

  describe('markCancelled', () => {
    it('marks event as cancelled', () => {
      const event = new Event('1', 'Event', tomorrow, '10:00', tomorrow, '11:00', now, now);
      event.markCancelled();
      expect(event.status).toBe('cancelled');
    });
  });
});
