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

beforeEach(async () => {
  raw = new DatabaseSync(':memory:');
  vi.resetModules();
  const db = await import('./db');
  await db.closeDatabase();
  await db.initializeDatabase();
});

describe('CRUD against real SQLite', () => {
  it('tasks: create, list, complete, delete', async () => {
    const t = await import('./tasks');
    await t.createTask('t1', 'Comprar pan', Date.now() + 1000);
    expect((await t.getTasks()).map((x) => x.id)).toEqual(['t1']);
    await t.completeTask('t1');
    expect((await t.getTask('t1'))?.status).toBe('completed');
    await t.deleteTask('t1');
    expect(await t.getTasks()).toEqual([]);
  });

  it('notes: create, search, update, delete', async () => {
    const n = await import('./notes');
    await n.createNote('n1', 'Idea brillante', 'important');
    expect((await n.searchNotes('brillante')).length).toBe(1);
    await n.updateNote('n1', { content: 'Otra idea' });
    expect((await n.getNote('n1'))?.content).toBe('Otra idea');
    await n.deleteNote('n1');
    expect(await n.getNotes()).toEqual([]);
  });

  it('events: create and list', async () => {
    const e = await import('./events');
    const now = Date.now();
    await e.createEvent('e1', 'Reunion', now, '10:00', now, '11:00');
    expect((await e.getEvents()).length).toBe(1);
    await e.updateEvent('e1', { description: 'Reunion movida' });
    expect((await e.getEvent('e1'))?.description).toBe('Reunion movida');
  });

  it('habits: create, log completion, stats', async () => {
    const h = await import('./habits');
    await h.createHabit('h1', 'Leer');
    await h.updateHabit('h1', { name: 'Leer mas' });
    expect((await h.getHabit('h1'))?.name).toBe('Leer mas');
    await h.logHabitCompletion('l1', 'h1', '2026-10-21', 'completed');
    expect((await h.getHabitLogs('h1')).length).toBe(1);
    const stats = await h.getHabitCompletionStats('h1', 2026, 10);
    expect(stats['2026-10-21']).toBe('completed');
  });

  it('categories are seeded', async () => {
    const c = await import('./categories');
    expect(await c.countCategories()).toBe(6);
  });

  it('timeline: all four record types appear after creation and disappear after delete', async () => {
    const t = await import('./tasks');
    const n = await import('./notes');
    const e = await import('./events');
    const h = await import('./habits');
    const { buildTimeline } = await import('../utils/timeline');
    const day = new Date(2026, 9, 21).getTime();

    await t.createTask('t1', 'Tarea', day);
    await n.createNote('n1', 'Nota', 'important');
    await e.createEvent('e1', 'Evento', day, '09:00', day, '10:00', 'upcoming', 'Oficina');
    await h.createHabit('h1', 'Habito', day);

    const load = async () =>
      buildTimeline(await t.getTasks(), await n.getNotes(), await e.getEvents(), await h.getHabits());

    const items = await load();
    expect(items.map((i) => i.kind).sort()).toEqual(['event', 'habit', 'note', 'task']);
    expect(items.find((i) => i.kind === 'event')?.subtitle).toContain('Oficina');

    await e.deleteEvent('e1');
    await h.deleteHabit('h1');
    expect((await load()).map((i) => i.kind).sort()).toEqual(['note', 'task']);
  });
});