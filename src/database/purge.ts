/**
 * Eliminacion definitiva de un registro (borrado fisico, no reversible)
 */

import { transaction } from './db';

export async function purgeRecord(id: string): Promise<void> {
  await transaction([
    { sql: 'DELETE FROM record_categories WHERE record_id = ?', params: [id] },
    { sql: 'DELETE FROM habit_logs WHERE habit_id = ?', params: [id] },
    { sql: 'DELETE FROM tasks WHERE id = ?', params: [id] },
    { sql: 'DELETE FROM notes WHERE id = ?', params: [id] },
    { sql: 'DELETE FROM events WHERE id = ?', params: [id] },
    { sql: 'DELETE FROM habits WHERE id = ?', params: [id] },
    { sql: 'DELETE FROM records WHERE id = ?', params: [id] },
  ]);
}
