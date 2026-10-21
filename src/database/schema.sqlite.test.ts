import { describe, it, expect } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import { CREATE_TABLES_SQL, SEED_CATEGORIES_SQL } from './schema';

function freshDb() {
  const db = new DatabaseSync(':memory:');
  db.exec(CREATE_TABLES_SQL);
  db.exec(SEED_CATEGORIES_SQL);
  return db;
}

describe('schema against real SQLite', () => {
  it('creates all tables', () => {
    const db = freshDb();
    const names = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all()
      .map((r: any) => r.name);
    for (const t of ['categories', 'records', 'tasks', 'notes', 'events', 'habits', 'habit_logs', 'record_categories']) {
      expect(names).toContain(t);
    }
  });

  it('seeds 6 categories and is idempotent on re-init', () => {
    const db = freshDb();
    db.exec(CREATE_TABLES_SQL);
    db.exec(SEED_CATEGORIES_SQL);
    const row: any = db.prepare('SELECT COUNT(*) AS n FROM categories').get();
    expect(row.n).toBe(6);
  });

  it('runs the timeline task join query', () => {
    const db = freshDb();
    const rows = db
      .prepare(
        'SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted, t.description, t.due_date, t.status, t.completed_at FROM records r JOIN tasks t ON r.id = t.id WHERE r.deleted = 0 ORDER BY r.created_at DESC'
      )
      .all();
    expect(rows).toEqual([]);
  });
});
