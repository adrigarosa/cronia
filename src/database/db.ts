/**
 * Gestor de base de datos SQLite para CRONIA
 * Maneja la inicialización, migraciones y operaciones básicas
 */

import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL, SEED_CATEGORIES_SQL, SCHEMA_VERSION } from './schema';
import { Category, Record as DBRecord, Task, Note, Event, Habit, HabitLog } from './types';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Obtener instancia de la base de datos
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('cronia.db');
  }
  return db;
}

/**
 * Inicializar la base de datos
 * Crea las tablas y siembra datos predeterminados
 */
/**
 * Migraciones para bases de datos creadas con versiones anteriores del esquema
 */
async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  const addColumnIfMissing = async (table: string, column: string, definition: string) => {
    const columns = await database.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`);
    if (!columns.some((c) => c.name === column)) {
      await database.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
  };
  await addColumnIfMissing('categories', 'archived', 'INTEGER NOT NULL DEFAULT 0');
  await addColumnIfMissing('habits', 'days', "TEXT NOT NULL DEFAULT '1111111'");
}

export async function initializeDatabase(): Promise<void> {
  try {
    const database = await getDatabase();

    // Ejecutar SQL de creación de tablas
    await database.execAsync(CREATE_TABLES_SQL);
    await runMigrations(database);

    // Insertar categorías predeterminadas
    await database.execAsync(SEED_CATEGORIES_SQL);

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}

/**
 * Ejecutar una consulta SELECT
 */
export async function query<T>(sql: string, params: (string | number | boolean)[] = []): Promise<T[]> {
  try {
    const database = await getDatabase();
    const result = await database.getAllAsync<T>(sql, params);
    return result || [];
  } catch (error) {
    console.error('❌ Error en query:', sql, error);
    throw error;
  }
}

/**
 * Ejecutar una consulta que retorna un único resultado
 */
export async function queryOne<T>(sql: string, params: (string | number | boolean)[] = []): Promise<T | null> {
  try {
    const results = await query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('❌ Error en queryOne:', sql, error);
    throw error;
  }
}

/**
 * Ejecutar una inserción/actualización/eliminación
 */
export async function execute(sql: string, params: (string | number | boolean)[] = []): Promise<SQLite.SQLiteRunResult> {
  try {
    const database = await getDatabase();
    const result = await database.runAsync(sql, params);
    return result;
  } catch (error) {
    console.error('❌ Error en execute:', sql, error);
    throw error;
  }
}

/**
 * Ejecutar múltiples sentencias SQL en una transacción
 */
export async function transaction(queries: Array<{ sql: string; params?: (string | number | boolean)[] }>): Promise<void> {
  try {
    const database = await getDatabase();
    await database.withTransactionAsync(async () => {
      for (const { sql, params = [] } of queries) {
        await database.runAsync(sql, params);
      }
    });
  } catch (error) {
    console.error('❌ Error en transacción:', error);
    throw error;
  }
}

/**
 * Obtener todas las categorías
 */
export async function getCategories(): Promise<Category[]> {
  return query<Category>('SELECT * FROM categories ORDER BY name');
}

/**
 * Obtener una categoría por ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  return queryOne<Category>('SELECT * FROM categories WHERE id = ?', [id]);
}

/**
 * Crear una nueva categoría
 */
export async function createCategory(id: string, name: string): Promise<Category> {
  const now = Date.now();
  await execute(
    'INSERT INTO categories (id, name, created_at) VALUES (?, ?, ?)',
    [id, name, now]
  );
  return { id, name, created_at: now, archived: 0 };
}

/**
 * Limpiar toda la base de datos (para desarrollo/testing)
 */
export async function clearDatabase(): Promise<void> {
  try {
    const database = await getDatabase();
    await database.execAsync('DELETE FROM record_categories; DELETE FROM habit_logs; DELETE FROM tasks; DELETE FROM notes; DELETE FROM events; DELETE FROM habits; DELETE FROM records; DELETE FROM categories;');
    console.log('✅ Base de datos limpiada');
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
    throw error;
  }
}

/**
 * Cerrar la conexión a la base de datos
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
