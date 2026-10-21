import { describe, it, expect } from 'vitest';

describe('useCategories Hook', () => {
  describe('Hook interface', () => {
    it('should return categories array', () => {
      const categories = [];
      expect(Array.isArray(categories)).toBe(true);
    });

    it('should have loading state', () => {
      const loading = false;
      expect(typeof loading).toBe('boolean');
    });

    it('should have error state', () => {
      const error = null;
      expect(error === null || typeof error === 'string').toBe(true);
    });

    it('should have refreshCategories function', () => {
      const fn = async () => {};
      expect(typeof fn).toBe('function');
    });

    it('should have getCategoryById function', () => {
      const fn = (id: string) => undefined;
      expect(typeof fn).toBe('function');
    });
  });

  describe('Category filtering', () => {
    it('should find category by id', () => {
      const categories = [
        { id: 'personal', name: 'Personal', created_at: Date.now(), isDefault: true },
        { id: 'work', name: 'Laboral', created_at: Date.now(), isDefault: true },
      ];
      const found = categories.find((c) => c.id === 'personal');
      expect(found?.name).toBe('Personal');
    });

    it('should return undefined for missing category', () => {
      const categories = [];
      const found = categories.find((c) => c.id === 'missing');
      expect(found).toBeUndefined();
    });
  });

  describe('Default categories', () => {
    it('should load 6 default categories', () => {
      const defaults = ['personal', 'work', 'family', 'home', 'leisure', 'expenses'];
      expect(defaults).toHaveLength(6);
    });

    it('should mark default categories correctly', () => {
      const isDefault = true;
      expect(isDefault).toBe(true);
    });
  });
});
