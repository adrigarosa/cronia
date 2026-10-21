import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseSync } from 'node:sqlite';

let raw: DatabaseSync;

vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: async () => ({
    execAsync: async (sql: string) => raw.exec(sql),
    getAllAsync: async (sql: string, params: any[] = []) => raw.prepare(sql).all(...params),
    getFirstAsync: async (sql: string, params: any[] = []) => raw.prepare(sql).get(...params) ?? null,
    runAsync: async (sql: string, params: any[] = []) => {
      const r = raw.prepare(sql).run(...params);
      return { changes: Number(r.changes), lastInsertRowId: Number(r.lastInsertRowid) };
    },
    withTransactionAsync: async (fn: () => Promise<void>) => {
      raw.exec('BEGIN');
      try {
        await fn();
        raw.exec('COMMIT');
      } catch (e) {
        raw.exec('ROLLBACK');
        throw e;
      }
    },
    closeAsync: async () => {},
  }),
}));

const OLD_SCHEMA = `
  CREATE TABLE categories (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL);
  CREATE TABLE records (id TEXT PRIMARY KEY, type TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE habits (id TEXT PRIMARY KEY, name TEXT NOT NULL, start_date INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1);
  INSERT INTO categories VALUES ('old', 'Vieja', 1);
  INSERT INTO records VALUES ('h-old', 'habit', 1, 1, 0);
  INSERT INTO habits VALUES ('h-old', 'Habito viejo', 1, 1);
`;

describe('migration from the old schema', () => {
  beforeEach(() => {
    raw = new DatabaseSync(':memory:');
    vi.resetModules();
  });

  it('adds archived and days columns without losing data', async () => {
    raw.exec(OLD_SCHEMA);
    const db = await import('./db');
    await db.closeDatabase();
    await db.initializeDatabase();

    const cat: any = raw.prepare("SELECT * FROM categories WHERE id = 'old'").get();
    expect(cat.name).toBe('Vieja');
    expect(cat.archived).toBe(0);

    const habit: any = raw.prepare("SELECT * FROM habits WHERE id = 'h-old'").get();
    expect(habit.name).toBe('Habito viejo');
    expect(habit.days).toBe('1111111');
  });

  it('is safe to run twice', async () => {
    raw.exec(OLD_SCHEMA);
    const db = await import('./db');
    await db.closeDatabase();
    await db.initializeDatabase();
    await db.initializeDatabase();
    const cols = raw.prepare('PRAGMA table_info(habits)').all().map((c: any) => c.name);
    expect(cols.filter((n: string) => n === 'days')).toHaveLength(1);
  });
});
