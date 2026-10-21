import { execute, query, transaction } from './db';

/**
 * Asignar categorias a un registro (reemplaza las anteriores)
 */
export async function setRecordCategories(recordId: string, categoryIds: string[]): Promise<void> {
  await transaction([
    { sql: 'DELETE FROM record_categories WHERE record_id = ?', params: [recordId] },
    ...categoryIds.map((categoryId) => ({
      sql: 'INSERT OR IGNORE INTO record_categories (record_id, category_id) VALUES (?, ?)',
      params: [recordId, categoryId],
    })),
  ]);
}

/**
 * Mapa recordId -> ids de categoria, solo de registros no eliminados
 */
export async function getRecordCategoryMap(): Promise<Record<string, string[]>> {
  const rows = await query<{ record_id: string; category_id: string }>(
    `SELECT rc.record_id, rc.category_id
     FROM record_categories rc
     JOIN records r ON r.id = rc.record_id
     WHERE r.deleted = 0`
  );
  const map: Record<string, string[]> = {};
  for (const row of rows) {
    (map[row.record_id] ||= []).push(row.category_id);
  }
  return map;
}

/**
 * Numero de registros (no eliminados) por categoria
 */
export async function countRecordsByCategory(): Promise<Record<string, number>> {
  const rows = await query<{ category_id: string; n: number }>(
    `SELECT rc.category_id, COUNT(*) AS n
     FROM record_categories rc
     JOIN records r ON r.id = rc.record_id
     WHERE r.deleted = 0
     GROUP BY rc.category_id`
  );
  const map: Record<string, number> = {};
  for (const row of rows) map[row.category_id] = row.n;
  return map;
}

export async function clearRecordCategories(recordId: string): Promise<void> {
  await execute('DELETE FROM record_categories WHERE record_id = ?', [recordId]);
}
