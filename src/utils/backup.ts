/**
 * Copia de seguridad: serialización y validación del JSON de exportación.
 * Módulo puro (sin SQLite) para poder testearlo con vitest.
 */

import type { Task, Note, Event, Habit, HabitLog, Category } from '../database/types';

export const BACKUP_VERSION = '1';

export interface BackupFile {
  version: string;
  exportDate: string;
  tasks: Task[];
  notes: Note[];
  events: Event[];
  habits: Habit[];
  habitLogs: HabitLog[];
  categories: Category[];
  /** recordId -> categoryIds */
  categoryMap: Record<string, string[]>;
}

export interface BackupSource {
  tasks: Task[];
  notes: Note[];
  events: Event[];
  habits: Habit[];
  logs: HabitLog[];
  categories: Category[];
  categoryMap: Record<string, string[]>;
}

export function buildBackupJson(src: BackupSource, now: number): string {
  const data: BackupFile = {
    version: BACKUP_VERSION,
    exportDate: new Date(now).toISOString(),
    tasks: src.tasks,
    notes: src.notes,
    events: src.events,
    habits: src.habits,
    habitLogs: src.logs,
    categories: src.categories,
    categoryMap: src.categoryMap,
  };
  return JSON.stringify(data, null, 2);
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function withId<T extends { id: string }>(list: unknown): T[] {
  return arr(list).filter((x): x is T => isObject(x) && typeof x.id === 'string');
}

/**
 * Parsea y sanea un JSON de copia. Lanza Error con mensaje en español
 * si el archivo no es una copia de CRONIA utilizable.
 */
export function parseBackupJson(json: string): BackupFile {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error('El archivo no es un JSON válido.');
  }
  if (!isObject(raw) || typeof raw.version !== 'string') {
    throw new Error('El archivo no parece una copia de CRONIA.');
  }

  const categoryMap: Record<string, string[]> = {};
  if (isObject(raw.categoryMap)) {
    for (const [recordId, cats] of Object.entries(raw.categoryMap)) {
      if (Array.isArray(cats)) {
        categoryMap[recordId] = cats.filter((c): c is string => typeof c === 'string');
      }
    }
  }

  return {
    version: raw.version,
    exportDate: typeof raw.exportDate === 'string' ? raw.exportDate : '',
    tasks: withId<Task>(raw.tasks),
    notes: withId<Note>(raw.notes),
    events: withId<Event>(raw.events),
    habits: withId<Habit>(raw.habits),
    habitLogs: withId<HabitLog>(raw.habitLogs),
    categories: withId<Category>(raw.categories),
    categoryMap,
  };
}
