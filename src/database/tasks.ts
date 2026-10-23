/**
 * Operaciones CRUD para tareas
 */

import { execute, query, queryOne, transaction } from './db';
import { Task, TaskStatus } from './types';

/**
 * Crear una nueva tarea
 */
export async function createTask(
  id: string,
  description: string,
  dueDate?: number,
  status: TaskStatus = 'pending'
): Promise<Task> {
  const now = Date.now();

  await transaction([
    {
      sql: 'INSERT INTO records (id, type, created_at, updated_at, deleted) VALUES (?, ?, ?, ?, ?)',
      params: [id, 'task', now, now, 0],
    },
    {
      sql: 'INSERT INTO tasks (id, description, due_date, status, completed_at) VALUES (?, ?, ?, ?, ?)',
      params: [id, description, dueDate || null, status, null],
    },
  ]);

  return {
    id,
    type: 'task',
    description,
    due_date: dueDate,
    status,
    completed_at: undefined,
    created_at: now,
    updated_at: now,
    deleted: false,
  };
}

/**
 * Obtener una tarea por ID
 */
export async function getTask(id: string): Promise<Task | null> {
  return queryOne<Task>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            t.description, t.due_date, t.status, t.completed_at
     FROM records r
     JOIN tasks t ON r.id = t.id
     WHERE r.id = ? AND r.deleted = 0`,
    [id]
  );
}

/**
 * Obtener todas las tareas (no eliminadas)
 */
export async function getTasks(): Promise<Task[]> {
  return query<Task>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            t.description, t.due_date, t.status, t.completed_at
     FROM records r
     JOIN tasks t ON r.id = t.id
     WHERE r.deleted = 0
     ORDER BY r.created_at DESC`
  );
}

/**
 * Obtener tareas por estado
 */
export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
  return query<Task>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            t.description, t.due_date, t.status, t.completed_at
     FROM records r
     JOIN tasks t ON r.id = t.id
     WHERE t.status = ? AND r.deleted = 0
     ORDER BY r.created_at DESC`,
    [status]
  );
}

/**
 * Actualizar una tarea
 */
export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, 'id' | 'type' | 'created_at' | 'updated_at' | 'deleted' | 'due_date'>> & {
    due_date?: number | null;
  }
): Promise<Task | null> {
  const now = Date.now();
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (updates.description !== undefined) {
    fields.push('description = ?');
    params.push(updates.description);
  }
  if (updates.due_date !== undefined) {
    fields.push('due_date = ?');
    params.push(updates.due_date);
  }
  if (updates.status !== undefined) {
    fields.push('status = ?');
    params.push(updates.status);
  }
  if (updates.completed_at !== undefined) {
    fields.push('completed_at = ?');
    params.push(updates.completed_at);
  }

  if (fields.length === 0) {
    return getTask(id);
  }

  params.push(id);

  await transaction([
    {
      sql: `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      params,
    },
    {
      sql: 'UPDATE records SET updated_at = ? WHERE id = ?',
      params: [now, id],
    },
  ]);

  return getTask(id);
}

/**
 * Marcar una tarea como completada
 */
export async function completeTask(id: string): Promise<Task | null> {
  const now = Date.now();
  return updateTask(id, {
    status: 'completed',
    completed_at: now,
  });
}

/**
 * Eliminar una tarea (soft delete)
 */
export async function deleteTask(id: string): Promise<void> {
  await execute('UPDATE records SET deleted = 1 WHERE id = ?', [id]);
}

/**
 * Contar tareas por estado
 */
export async function countTasksByStatus(status: TaskStatus): Promise<number> {
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM tasks t
     JOIN records r ON t.id = r.id
     WHERE t.status = ? AND r.deleted = 0`,
    [status]
  );
  return result?.count || 0;
}

/**
 * Obtener tareas vencidas
 */
export async function getOverdueTasks(): Promise<Task[]> {
  const now = Date.now();
  return query<Task>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            t.description, t.due_date, t.status, t.completed_at
     FROM records r
     JOIN tasks t ON r.id = t.id
     WHERE t.due_date <= ? AND t.status IN ('pending', 'in_progress') AND r.deleted = 0
     ORDER BY t.due_date ASC`,
    [now]
  );
}
