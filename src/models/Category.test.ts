import { describe, it, expect } from 'vitest';
import { Category } from './Category';

describe('Category Model', () => {
  describe('Constructor', () => {
    it('creates a category', () => {
      const category = new Category('personal', 'Personal', Date.now(), true);
      expect(category.id).toBe('personal');
      expect(category.name).toBe('Personal');
      expect(category.isDefault).toBe(true);
    });
  });

  describe('DEFAULTS', () => {
    it('contains all default categories', () => {
      const defaults = Category.DEFAULTS;
      expect(defaults.PERSONAL).toBe('personal');
      expect(defaults.WORK).toBe('work');
      expect(defaults.FAMILY).toBe('family');
      expect(defaults.HOME).toBe('home');
      expect(defaults.LEISURE).toBe('leisure');
      expect(defaults.EXPENSES).toBe('expenses');
    });
  });

  describe('DEFAULT_NAMES', () => {
    it('has names for all default categories', () => {
      expect(Category.DEFAULT_NAMES.personal).toBe('Personal');
      expect(Category.DEFAULT_NAMES.work).toBe('Laboral');
      expect(Category.DEFAULT_NAMES.family).toBe('Familiar');
      expect(Category.DEFAULT_NAMES.home).toBe('Hogar');
      expect(Category.DEFAULT_NAMES.leisure).toBe('Ocio');
      expect(Category.DEFAULT_NAMES.expenses).toBe('Gastos');
    });
  });

  describe('isDefaultCategory', () => {
    it('returns true for default categories', () => {
      expect(Category.isDefaultCategory('personal')).toBe(true);
      expect(Category.isDefaultCategory('work')).toBe(true);
    });

    it('returns false for custom categories', () => {
      expect(Category.isDefaultCategory('custom')).toBe(false);
    });
  });

  describe('getDefaultName', () => {
    it('returns name for default category', () => {
      expect(Category.getDefaultName('personal')).toBe('Personal');
      expect(Category.getDefaultName('work')).toBe('Laboral');
    });

    it('returns null for unknown category', () => {
      expect(Category.getDefaultName('unknown')).toBeNull();
    });
  });
});
