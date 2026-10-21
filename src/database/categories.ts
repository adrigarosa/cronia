/**
 * Operaciones CRUD para categorias
 */

import { execute, query, queryOne, transaction } from './db';
import { Category } from './types';

/**
 * Crear una nueva categoria
 */
export async function createCategory(
  id: string,
  name: string
): Promise<Category> {
  const now = Date.now();
  await execute(
    'INSERT INTO categories (id, name, created_at) VALUES (?, ?, ?)',
    [id, name, now]
  );
  return { id, name, created_at: now, archived: 0 };
}

/**
 * Obtener una categoria por ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  return queryOne<Category>(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );
}

/**
 * Obtener todas las categorias
 */
export async function getCategories(): Promise<Category[]> {
  return query<Category>(
    'SELECT * FROM categories ORDER BY name'
  );
}

/**
 * Obtener categorias por nombre (busqueda)
 */
export async function getCategoriesByName(name: string): Promise<Category[]> {
  return query<Category>(
    'SELECT * FROM categories WHERE name LIKE ? ORDER BY name',
    [`%${name}%`]
  );
}

/**
 * Actualizar una categoria
 */
export async function updateCategory(
  id: string,
  name: string
): Promise<Category | null> {
  await execute(
    'UPDATE categories SET name = ? WHERE id = ?',
    [name, id]
  );
  return getCategoryById(id);
}

/**
 * Eliminar una categoria
 */
export async function deleteCategory(id: string): Promise<void> {
  await execute(
    'DELETE FROM categories WHERE id = ?',
    [id]
  );
}

/**
 * Contar total de categorias
 */
export async function countCategories(): Promise<number> {
  const result = await queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories'
  );
  return result?.count || 0;
}

/**
 * Verificar si una categoria existe
 */
export async function categoryExists(id: string): Promise<boolean> {
  const result = await queryOne<{ exists: number }>(
    'SELECT 1 as exists FROM categories WHERE id = ?',
    [id]
  );
  return !!result;
}

/**
 * Archivar o restaurar una categoria (no borra los registros que la usan)
 */
export async function setCategoryArchived(id: string, archived: boolean): Promise<void> {
  await execute('UPDATE categories SET archived = ? WHERE id = ?', [archived ? 1 : 0, id]);
}
