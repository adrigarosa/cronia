/**
 * Operaciones CRUD para eventos
 */

import { execute, query, queryOne, transaction } from './db';
import { Event, EventStatus } from './types';

/**
 * Crear un nuevo evento
 */
export async function createEvent(
  id: string,
  description: string,
  startDate: number,
  startTime: string,
  endDate: number,
  endTime: string,
  status: EventStatus = 'upcoming',
  location?: string
): Promise<Event> {
  const now = Date.now();

  await transaction([
    {
      sql: 'INSERT INTO records (id, type, created_at, updated_at, deleted) VALUES (?, ?, ?, ?, ?)',
      params: [id, 'event', now, now, 0],
    },
    {
      sql: 'INSERT INTO events (id, description, start_date, start_time, end_date, end_time, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      params: [id, description, startDate, startTime, endDate, endTime, location || null, status],
    },
  ]);

  return {
    id,
    type: 'event',
    description,
    start_date: startDate,
    start_time: startTime,
    end_date: endDate,
    end_time: endTime,
    location,
    status,
    created_at: now,
    updated_at: now,
    deleted: false,
  };
}

/**
 * Obtener un evento por ID
 */
export async function getEvent(id: string): Promise<Event | null> {
  return queryOne<Event>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            e.description, e.start_date, e.start_time, e.end_date, e.end_time, e.location, e.status
     FROM records r
     JOIN events e ON r.id = e.id
     WHERE r.id = ? AND r.deleted = 0`,
    [id]
  );
}

/**
 * Obtener todos los eventos (no eliminados)
 */
export async function getEvents(): Promise<Event[]> {
  return query<Event>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            e.description, e.start_date, e.start_time, e.end_date, e.end_time, e.location, e.status
     FROM records r
     JOIN events e ON r.id = e.id
     WHERE r.deleted = 0
     ORDER BY e.start_date ASC, e.start_time ASC`
  );
}

/**
 * Obtener eventos por rango de fechas
 */
export async function getEventsByDateRange(
  startDate: number,
  endDate: number
): Promise<Event[]> {
  return query<Event>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            e.description, e.start_date, e.start_time, e.end_date, e.end_time, e.location, e.status
     FROM records r
     JOIN events e ON r.id = e.id
     WHERE e.start_date >= ? AND e.start_date <= ? AND r.deleted = 0
     ORDER BY e.start_date ASC, e.start_time ASC`,
    [startDate, endDate]
  );
}

/**
 * Obtener eventos proximos
 */
export async function getUpcomingEvents(): Promise<Event[]> {
  const now = Date.now();
  return query<Event>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            e.description, e.start_date, e.start_time, e.end_date, e.end_time, e.location, e.status
     FROM records r
     JOIN events e ON r.id = e.id
     WHERE e.start_date > ? AND r.deleted = 0
     ORDER BY e.start_date ASC, e.start_time ASC`,
    [now]
  );
}

/**
 * Actualizar un evento
 */
export async function updateEvent(
  id: string,
  updates: Partial<Omit<Event, 'id' | 'type' | 'created_at' | 'updated_at' | 'deleted'>>
): Promise<Event | null> {
  const now = Date.now();
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (updates.description !== undefined) {
    fields.push('description = ?');
    params.push(updates.description);
  }
  if (updates.start_date !== undefined) {
    fields.push('start_date = ?');
    params.push(updates.start_date);
  }
  if (updates.start_time !== undefined) {
    fields.push('start_time = ?');
    params.push(updates.start_time);
  }
  if (updates.end_date !== undefined) {
    fields.push('end_date = ?');
    params.push(updates.end_date);
  }
  if (updates.end_time !== undefined) {
    fields.push('end_time = ?');
    params.push(updates.end_time);
  }
  if (updates.location !== undefined) {
    fields.push('location = ?');
    params.push(updates.location);
  }
  if (updates.status !== undefined) {
    fields.push('status = ?');
    params.push(updates.status);
  }

  if (fields.length === 0) {
    return getEvent(id);
  }

  params.push(id);

  await transaction([
    {
      sql: `UPDATE events SET ${fields.join(', ')} WHERE id = ?`,
      params: params.slice(0, -1),
    },
    {
      sql: 'UPDATE records SET updated_at = ? WHERE id = ?',
      params: [now, id],
    },
  ]);

  return getEvent(id);
}

/**
 * Eliminar un evento (soft delete)
 */
export async function deleteEvent(id: string): Promise<void> {
  await execute('UPDATE records SET deleted = 1 WHERE id = ?', [id]);
}

/**
 * Contar total de eventos
 */
export async function countEvents(): Promise<number> {
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM events e
     JOIN records r ON e.id = r.id
     WHERE r.deleted = 0`
  );
  return result?.count || 0;
}
