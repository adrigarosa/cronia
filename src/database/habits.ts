/**
 * Operaciones CRUD para habitos
 */

import { execute, query, queryOne, transaction } from './db';
import { Habit, HabitLog, HabitStatus } from './types';

/**
 * Crear un nuevo habito
 */
export async function createHabit(
  id: string,
  name: string,
  startDate: number = Date.now(),
  active: boolean = true,
  days: string = '1111111'
): Promise<Habit> {
  const now = Date.now();

  await transaction([
    {
      sql: 'INSERT INTO records (id, type, created_at, updated_at, deleted) VALUES (?, ?, ?, ?, ?)',
      params: [id, 'habit', now, now, 0],
    },
    {
      sql: 'INSERT INTO habits (id, name, start_date, active, days) VALUES (?, ?, ?, ?, ?)',
      params: [id, name, startDate, active ? 1 : 0, days],
    },
  ]);

  return {
    id,
    type: 'habit',
    name,
    start_date: startDate,
    active,
    days,
    created_at: now,
    updated_at: now,
    deleted: false,
  };
}

/**
 * Obtener un habito por ID
 */
export async function getHabit(id: string): Promise<Habit | null> {
  return queryOne<Habit>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            h.name, h.start_date, h.active, h.days
     FROM records r
     JOIN habits h ON r.id = h.id
     WHERE r.id = ? AND r.deleted = 0`,
    [id]
  );
}

/**
 * Obtener todos los habitos
 */
export async function getHabits(): Promise<Habit[]> {
  return query<Habit>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            h.name, h.start_date, h.active, h.days
     FROM records r
     JOIN habits h ON r.id = h.id
     WHERE r.deleted = 0
     ORDER BY h.name ASC`
  );
}

/**
 * Obtener solo habitos activos
 */
export async function getActiveHabits(): Promise<Habit[]> {
  return query<Habit>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            h.name, h.start_date, h.active, h.days
     FROM records r
     JOIN habits h ON r.id = h.id
     WHERE h.active = 1 AND r.deleted = 0
     ORDER BY h.name ASC`
  );
}

/**
 * Actualizar un habito
 */
export async function updateHabit(
  id: string,
  updates: Partial<Omit<Habit, 'id' | 'type' | 'created_at' | 'updated_at' | 'deleted'>>
): Promise<Habit | null> {
  const now = Date.now();
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    params.push(updates.name);
  }
  if (updates.start_date !== undefined) {
    fields.push('start_date = ?');
    params.push(updates.start_date);
  }
  if (updates.active !== undefined) {
    fields.push('active = ?');
    params.push(updates.active ? 1 : 0);
  }
  if (updates.days !== undefined) {
    fields.push('days = ?');
    params.push(updates.days);
  }

  if (fields.length === 0) {
    return getHabit(id);
  }

  params.push(id);

  await transaction([
    {
      sql: `UPDATE habits SET ${fields.join(', ')} WHERE id = ?`,
      params,
    },
    {
      sql: 'UPDATE records SET updated_at = ? WHERE id = ?',
      params: [now, id],
    },
  ]);

  return getHabit(id);
}

/**
 * Eliminar un habito
 */
export async function deleteHabit(id: string): Promise<void> {
  await execute('UPDATE records SET deleted = 1 WHERE id = ?', [id]);
}

/**
 * Crear un registro de cumplimiento de habito
 */
export async function logHabitCompletion(
  id: string,
  habitId: string,
  date: string,
  status: HabitStatus = 'completed',
  note?: string
): Promise<HabitLog> {
  const now = Date.now();

  await execute(
    `INSERT OR REPLACE INTO habit_logs (id, habit_id, date, status, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, habitId, date, status, note || null, now, now]
  );

  return {
    id,
    habit_id: habitId,
    date,
    status,
    note,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Obtener registros de habito para una fecha
 */
export async function getHabitLogsByDate(date: string): Promise<HabitLog[]> {
  return query<HabitLog>(
    `SELECT id, habit_id, date, status, note, created_at, updated_at FROM habit_logs WHERE date = ? ORDER BY created_at DESC`,
    [date]
  );
}

/**
 * Obtener registros de habito para un habito especifico
 */
export async function getHabitLogs(habitId: string): Promise<HabitLog[]> {
  return query<HabitLog>(
    `SELECT id, habit_id, date, status, note, created_at, updated_at FROM habit_logs WHERE habit_id = ? ORDER BY date DESC`,
    [habitId]
  );
}

/**
 * Obtener reporte de cumplimiento para un mes
 */
export async function getHabitCompletionStats(habitId: string, year: number, month: number): Promise<Record<string, HabitStatus>> {
  const logs = await query<HabitLog>(
    `SELECT id, habit_id, date, status, note, created_at, updated_at FROM habit_logs WHERE habit_id = ? AND strftime('%Y-%m', date) = ?`,
    [habitId, `${year}-${String(month).padStart(2, '0')}`]
  );

  const stats: Record<string, HabitStatus> = {};
  for (const log of logs) {
    stats[log.date] = log.status;
  }
  return stats;
}

/**
 * Fijar el estado de un habito en una fecha (crea o actualiza el registro del dia)
 */
export async function setHabitDayStatus(
  id: string,
  habitId: string,
  date: string,
  status: HabitStatus
): Promise<void> {
  const now = Date.now();
  await execute(
    `INSERT INTO habit_logs (id, habit_id, date, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(habit_id, date) DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at`,
    [id, habitId, date, status, now, now]
  );
}

/**
 * Obtener todos los registros de cumplimiento
 */
export async function getAllHabitLogs(): Promise<HabitLog[]> {
  return query<HabitLog>('SELECT * FROM habit_logs');
}