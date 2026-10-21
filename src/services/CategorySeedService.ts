/**
 * Servicio de inicializacion de categorias predeterminadas
 */

import { getCategories, createCategory, categoryExists } from '../database';
import { Category } from '../models';

/**
 * Categorias predeterminadas del sistema
 */
const DEFAULT_CATEGORIES_DATA = [
  { id: 'personal', name: 'Personal' },
  { id: 'work', name: 'Laboral' },
  { id: 'family', name: 'Familiar' },
  { id: 'home', name: 'Hogar' },
  { id: 'leisure', name: 'Ocio' },
  { id: 'expenses', name: 'Gastos' },
] as const;

/**
 * Seed de categorias predeterminadas en la base de datos
 * Solo crea las que no existen
 */
export async function seedDefaultCategories(): Promise<Category[]> {
  try {
    const categories: Category[] = [];

    for (const defaultCategory of DEFAULT_CATEGORIES_DATA) {
      const exists = await categoryExists(defaultCategory.id);
      if (!exists) {
        const now = Date.now();
        const newCategory = new Category(
          defaultCategory.id,
          defaultCategory.name,
          now,
          true
        );
        await createCategory(defaultCategory.id, defaultCategory.name);
        categories.push(newCategory);
        console.log(`Categoria creada: ${defaultCategory.name}`);
      } else {
        const now = Date.now();
        const category = new Category(
          defaultCategory.id,
          defaultCategory.name,
          now,
          true
        );
        categories.push(category);
      }
    }

    console.log(`Total categorias en BD: ${categories.length}`);
    return categories;
  } catch (error) {
    console.error('Error en seed de categorias:', error);
    throw error;
  }
}

/**
 * Obtener todas las categorias predeterminadas como modelos
 */
export async function loadDefaultCategories(): Promise<Category[]> {
  try {
    const dbCategories = await getCategories();
    return dbCategories.map(
      (cat) => new Category(cat.id, cat.name, cat.created_at, true)
    );
  } catch (error) {
    console.error('Error cargando categorias:', error);
    throw error;
  }
}

/**
 * Verificar que las 6 categorias predeterminadas existen
 */
export async function verifyDefaultCategories(): Promise<boolean> {
  try {
    const categories = await getCategories();
    const defaultIds = DEFAULT_CATEGORIES_DATA.map((c) => c.id);
    const existingIds = categories.map((c) => c.id);
    return defaultIds.every((id) => existingIds.includes(id));
  } catch (error) {
    console.error('Error verificando categorias:', error);
    return false;
  }
}
