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
    const { recordsOnDay, startOfDay } = await import('../domain/records');
    const day = startOfDay(Date.now());
    const now = Date.now();
    const src = async () => ({
      tasks: await t.getTasks(),
      notes: await n.getNotes(),
      events: await e.getEvents(),
      habits: await h.getHabits(),
      logs: [],
      categoryMap: {},
    });

    await t.createTask('t1', 'Tarea', day);
    await n.createNote('n1', 'Nota', 'important');
    await e.createEvent('e1', 'Evento', day, '09:00', day, '10:00', 'upcoming', 'Oficina');
    await h.createHabit('h1', 'Habito', day);

    const items = recordsOnDay(await src(), day, now);
    expect(items.map((i) => i.kind).sort()).toEqual(['E', 'H', 'N', 'T']);
    expect(items.find((i) => i.kind === 'E')?.meta).toContain('Oficina');

    await e.deleteEvent('e1');
    await h.deleteHabit('h1');
    expect(recordsOnDay(await src(), day, now).map((i) => i.kind).sort()).toEqual(['N', 'T']);
  });

  it('record categories: assign, replace, count and ignore deleted records', async () => {
    const t = await import('./tasks');
    const rc = await import('./recordCategories');
    await t.createTask('t1', 'Uno');
    await t.createTask('t2', 'Dos');
    await rc.setRecordCategories('t1', ['personal', 'work']);
    await rc.setRecordCategories('t2', ['work']);
    expect((await rc.getRecordCategoryMap())['t1'].sort()).toEqual(['personal', 'work']);
    expect((await rc.countRecordsByCategory())['work']).toBe(2);

    await rc.setRecordCategories('t1', ['home']);
    expect((await rc.getRecordCategoryMap())['t1']).toEqual(['home']);

    await t.deleteTask('t2');
    expect((await rc.countRecordsByCategory())['work']).toBeUndefined();
  });

  it('categories can be archived and restored without touching records', async () => {
    const c = await import('./categories');
    await c.setCategoryArchived('home', true);
    expect((await c.getCategoryById('home'))?.archived).toBe(1);
    await c.setCategoryArchived('home', false);
    expect((await c.getCategoryById('home'))?.archived).toBe(0);
  });

  it('habits: planned days are stored and day status is upserted', async () => {
    const h = await import('./habits');
    await h.createHabit('h1', 'Leer', Date.now(), true, '1111100');
    expect((await h.getHabit('h1'))?.days).toBe('1111100');
    await h.updateHabit('h1', { days: '0000011' });
    expect((await h.getHabit('h1'))?.days).toBe('0000011');

    await h.setHabitDayStatus('a', 'h1', '2026-10-21', 'completed');
    await h.setHabitDayStatus('b', 'h1', '2026-10-21', 'not_completed');
    const logs = await h.getAllHabitLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].status).toBe('not_completed');
  });
});