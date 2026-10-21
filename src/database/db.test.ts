import { describe, it, expect, beforeEach } from 'vitest';
import { CREATE_TABLES_SQL, DEFAULT_CATEGORIES, SEED_CATEGORIES_SQL } from './schema';

describe('Database Schema', () => {
  describe('CREATE_TABLES_SQL', () => {
    it('contains CREATE TABLE statements', () => {
      expect(CREATE_TABLES_SQL).toContain('CREATE TABLE');
      expect(CREATE_TABLES_SQL).toContain('categories');
      expect(CREATE_TABLES_SQL).toContain('records');
      expect(CREATE_TABLES_SQL).toContain('tasks');
      expect(CREATE_TABLES_SQL).toContain('notes');
      expect(CREATE_TABLES_SQL).toContain('events');
      expect(CREATE_TABLES_SQL).toContain('habits');
      expect(CREATE_TABLES_SQL).toContain('habit_logs');
      expect(CREATE_TABLES_SQL).toContain('record_categories');
    });

    it('includes indexes for performance', () => {
      expect(CREATE_TABLES_SQL).toContain('CREATE INDEX');
      expect(CREATE_TABLES_SQL).toContain('idx_records_type');
      expect(CREATE_TABLES_SQL).toContain('idx_tasks_status');
    });

    it('defines foreign keys and constraints', () => {
      expect(CREATE_TABLES_SQL).toContain('FOREIGN KEY');
      expect(CREATE_TABLES_SQL).toContain('UNIQUE');
      expect(CREATE_TABLES_SQL).toContain('PRIMARY KEY');
    });

    it('includes CHECK constraints for enums', () => {
      expect(CREATE_TABLES_SQL).toContain('CHECK(type IN');
      expect(CREATE_TABLES_SQL).toContain('CHECK(status IN');
      expect(CREATE_TABLES_SQL).toContain('CHECK(classification IN');
    });
  });

  describe('DEFAULT_CATEGORIES', () => {
    it('contains 6 default categories', () => {
      expect(DEFAULT_CATEGORIES).toHaveLength(6);
    });

    it('has required category names', () => {
      const categoryNames = DEFAULT_CATEGORIES.map(c => c.name);
      expect(categoryNames).toContain('Personal');
      expect(categoryNames).toContain('Laboral');
      expect(categoryNames).toContain('Familiar');
      expect(categoryNames).toContain('Hogar');
      expect(categoryNames).toContain('Ocio');
      expect(categoryNames).toContain('Gastos');
    });

    it('has unique IDs for each category', () => {
      const ids = DEFAULT_CATEGORIES.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('SEED_CATEGORIES_SQL', () => {
    it('contains INSERT statement', () => {
      expect(SEED_CATEGORIES_SQL).toContain('INSERT');
      expect(SEED_CATEGORIES_SQL).toContain('categories');
    });

    it('inserts default categories', () => {
      expect(SEED_CATEGORIES_SQL).toContain('Personal');
      expect(SEED_CATEGORIES_SQL).toContain('Laboral');
      expect(SEED_CATEGORIES_SQL).toContain('Familiar');
    });
  });
});
