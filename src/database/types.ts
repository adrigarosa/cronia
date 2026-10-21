/**
 * Tipos para la base de datos SQLite
 */

// Estados de tareas
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'deleted';

// Clasificaciones de notas
export type NoteClassification = 'important' | 'anecdote' | 'reminder' | 'reflection';

// Estados de eventos
export type EventStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

// Estados de hábitos
export type HabitStatus = 'completed' | 'pending' | 'not_completed';

// Entidades de base de datos

/**
 * Registro base - todos los registros comparten estos campos
 */
export interface Record {
  id: string;
  type: 'task' | 'note' | 'event' | 'habit';
  created_at: number;
  updated_at: number;
  deleted: boolean;
}

/**
 * Tarea
 */
export interface Task extends Record {
  type: 'task';
  description: string;
  due_date?: number; // Unix timestamp
  status: TaskStatus;
  completed_at?: number;
}

/**
 * Nota breve
 */
export interface Note extends Record {
  type: 'note';
  content: string;
  classification: NoteClassification;
}

/**
 * Evento/Cita
 */
export interface Event extends Record {
  type: 'event';
  description: string;
  start_date: number; // Unix timestamp
  start_time: string; // HH:mm
  end_date: number;
  end_time: string;
  location?: string;
  status: EventStatus;
}

/**
 * Definición de hábito
 */
export interface Habit extends Record {
  type: 'habit';
  name: string;
  start_date: number;
  active: boolean;
  days: string; // 7 chars L..D, "1" = day planned
}

/**
 * Registro diario de cumplimiento de hábito
 */
export interface HabitLog {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  status: HabitStatus;
  note?: string;
  created_at: number;
  updated_at: number;
}

/**
 * Categoría
 */
export interface Category {
  id: string;
  name: string;
  created_at: number;
  archived: number; // 0 | 1
}

/**
 * Relación entre registro y categoría
 */
export interface RecordCategory {
  record_id: string;
  category_id: string;
}

/**
 * Unión de todos los tipos de registro
 */
export type AnyRecord = Task | Note | Event | Habit;
