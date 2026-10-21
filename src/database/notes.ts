/**
 * Operaciones CRUD para notas
 */

import { execute, query, queryOne, transaction } from './db';
import { Note, NoteClassification } from './types';

/**
 * Crear una nueva nota
 */
export async function createNote(
  id: string,
  content: string,
  classification: NoteClassification = 'reminder'
): Promise<Note> {
  const now = Date.now();

  await transaction([
    {
      sql: 'INSERT INTO records (id, type, created_at, updated_at, deleted) VALUES (?, ?, ?, ?, ?)',
      params: [id, 'note', now, now, 0],
    },
    {
      sql: 'INSERT INTO notes (id, content, classification) VALUES (?, ?, ?)',
      params: [id, content, classification],
    },
  ]);

  return {
    id,
    type: 'note',
    content,
    classification,
    created_at: now,
    updated_at: now,
    deleted: false,
  };
}

/**
 * Obtener una nota por ID
 */
export async function getNote(id: string): Promise<Note | null> {
  return queryOne<Note>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            n.content, n.classification
     FROM records r
     JOIN notes n ON r.id = n.id
     WHERE r.id = ? AND r.deleted = 0`,
    [id]
  );
}

/**
 * Obtener todas las notas (no eliminadas)
 */
export async function getNotes(): Promise<Note[]> {
  return query<Note>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            n.content, n.classification
     FROM records r
     JOIN notes n ON r.id = n.id
     WHERE r.deleted = 0
     ORDER BY r.created_at DESC`
  );
}

/**
 * Obtener notas por clasificacion
 */
export async function getNotesByClassification(
  classification: NoteClassification
): Promise<Note[]> {
  return query<Note>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            n.content, n.classification
     FROM records r
     JOIN notes n ON r.id = n.id
     WHERE n.classification = ? AND r.deleted = 0
     ORDER BY r.created_at DESC`,
    [classification]
  );
}

/**
 * Actualizar una nota
 */
export async function updateNote(
  id: string,
  updates: Partial<Omit<Note, 'id' | 'type' | 'created_at' | 'updated_at' | 'deleted'>>
): Promise<Note | null> {
  const now = Date.now();
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (updates.content !== undefined) {
    fields.push('content = ?');
    params.push(updates.content);
  }
  if (updates.classification !== undefined) {
    fields.push('classification = ?');
    params.push(updates.classification);
  }

  if (fields.length === 0) {
    return getNote(id);
  }

  params.push(id);

  await transaction([
    {
      sql: `UPDATE notes SET ${fields.join(', ')} WHERE id = ?`,
      params: params.slice(0, -1),
    },
    {
      sql: 'UPDATE records SET updated_at = ? WHERE id = ?',
      params: [now, id],
    },
  ]);

  return getNote(id);
}

/**
 * Eliminar una nota (soft delete)
 */
export async function deleteNote(id: string): Promise<void> {
  await execute('UPDATE records SET deleted = 1 WHERE id = ?', [id]);
}

/**
 * Contar total de notas
 */
export async function countNotes(): Promise<number> {
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM notes n
     JOIN records r ON n.id = r.id
     WHERE r.deleted = 0`
  );
  return result?.count || 0;
}

/**
 * Buscar notas por contenido
 */
export async function searchNotes(searchTerm: string): Promise<Note[]> {
  return query<Note>(
    `SELECT r.id, r.type, r.created_at, r.updated_at, r.deleted,
            n.content, n.classification
     FROM records r
     JOIN notes n ON r.id = n.id
     WHERE n.content LIKE ? AND r.deleted = 0
     ORDER BY r.created_at DESC`,
    [`%${searchTerm}%`]
  );
}
