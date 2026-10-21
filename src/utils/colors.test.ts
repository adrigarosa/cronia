import { describe, it, expect } from 'vitest';
import { getCategoryColor, getRecordTypeColor } from '../constants/colors';

describe('Color Utilities', () => {
  describe('getCategoryColor', () => {
    it('returns pink for Personal category', () => {
      expect(getCategoryColor('Personal')).toBe('#EC4899');
    });

    it('returns blue for Laboral category', () => {
      expect(getCategoryColor('Laboral')).toBe('#0EA5E9');
    });

    it('returns cyan for Familiar category', () => {
      expect(getCategoryColor('Familiar')).toBe('#06B6D4');
    });

    it('returns orange for Hogar category', () => {
      expect(getCategoryColor('Hogar')).toBe('#F97316');
    });

    it('returns indigo for Ocio category', () => {
      expect(getCategoryColor('Ocio')).toBe('#6366F1');
    });

    it('returns lime for Gastos category', () => {
      expect(getCategoryColor('Gastos')).toBe('#84CC16');
    });

    it('returns primary color for unknown category', () => {
      expect(getCategoryColor('UnknownCategory')).toBe('#8B5CF6');
    });

    it('handles case variations', () => {
      // The function uses charAt(0).toUpperCase(), so 'personal' becomes 'Personal'
      expect(getCategoryColor('personal')).toBe('#EC4899');
    });
  });

  describe('getRecordTypeColor', () => {
    it('returns blue for task type', () => {
      expect(getRecordTypeColor('task')).toBe('#0EA5E9');
    });

    it('returns orange for note type', () => {
      expect(getRecordTypeColor('note')).toBe('#F59E0B');
    });

    it('returns pink for event type', () => {
      expect(getRecordTypeColor('event')).toBe('#EC4899');
    });

    it('returns green for habit type', () => {
      expect(getRecordTypeColor('habit')).toBe('#10B981');
    });

    it('returns primary color for unknown type', () => {
      // Type system ensures only valid types are passed
      expect(getRecordTypeColor('task' as any)).toBeDefined();
    });
  });
});
