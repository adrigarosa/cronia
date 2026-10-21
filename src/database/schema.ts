/**
 * Esquema de la base de datos SQLite
 * Define todas las tablas y sus columnas
 */

export const SCHEMA_VERSION = 1;

/**
 * SQL para crear todas las tablas
 */
export const CREATE_TABLES_SQL = `
  -- Tabla de categorías
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL
  );

  -- Tabla de registros base (unificada)
  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('task', 'note', 'event', 'habit')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    deleted INTEGER NOT NULL DEFAULT 0
  );

  -- Tabla de tareas (extiende records)
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    due_date INTEGER,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'deleted')),
    completed_at INTEGER,
    FOREIGN KEY(id) REFERENCES records(id) ON DELETE CASCADE
  );

  -- Tabla de notas (extiende records)
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    classification TEXT NOT NULL DEFAULT 'reminder' CHECK(classification IN ('important', 'anecdote', 'reminder', 'reflection')),
    FOREIGN KEY(id) REFERENCES records(id) ON DELETE CASCADE
  );

  -- Tabla de eventos (extiende records)
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    start_date INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_date INTEGER NOT NULL,
    end_time TEXT NOT NULL,
    location TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'in_progress', 'completed', 'cancelled')),
    FOREIGN KEY(id) REFERENCES records(id) ON DELETE CASCADE
  );

  -- Tabla de hábitos (extiende records)
  CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    start_date INTEGER NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY(id) REFERENCES records(id) ON DELETE CASCADE
  );

  -- Tabla de registros de cumplimiento de hábitos
  CREATE TABLE IF NOT EXISTS habit_logs (
    id TEXT PRIMARY KEY,
    habit_id TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('completed', 'pending', 'not_completed')),
    note TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    UNIQUE(habit_id, date),
    FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
  );

  -- Tabla de relaciones registro-categoría
  CREATE TABLE IF NOT EXISTS record_categories (
    record_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    PRIMARY KEY(record_id, category_id),
    FOREIGN KEY(record_id) REFERENCES records(id) ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  -- Índices para mejorar performance
  CREATE INDEX IF NOT EXISTS idx_records_type ON records(type);
  CREATE INDEX IF NOT EXISTS idx_records_created_at ON records(created_at);
  CREATE INDEX IF NOT EXISTS idx_records_deleted ON records(deleted);
  CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
  CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
  CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);
  CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
  CREATE INDEX IF NOT EXISTS idx_record_categories_category_id ON record_categories(category_id);
`;

/**
 * Categorías predeterminadas
 */
export const DEFAULT_CATEGORIES = [
  { id: 'personal', name: 'Personal' },
  { id: 'work', name: 'Laboral' },
  { id: 'family', name: 'Familiar' },
  { id: 'home', name: 'Hogar' },
  { id: 'leisure', name: 'Ocio' },
  { id: 'expenses', name: 'Gastos' },
] as const;

/**
 * SQL para insertar categorías predeterminadas
 */
export const SEED_CATEGORIES_SQL = `
  INSERT OR IGNORE INTO categories (id, name, created_at) VALUES
  ('personal', 'Personal', ${Date.now()}),
  ('work', 'Laboral', ${Date.now()}),
  ('family', 'Familiar', ${Date.now()}),
  ('home', 'Hogar', ${Date.now()}),
  ('leisure', 'Ocio', ${Date.now()}),
  ('expenses', 'Gastos', ${Date.now()});
`;
