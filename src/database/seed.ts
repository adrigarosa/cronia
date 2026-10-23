/**
 * Datos de prueba para ver el comportamiento de la app con muchos registros
 */

import { createTask, updateTask } from './tasks';
import { createNote } from './notes';
import { createEvent } from './events';
import { createHabit } from './habits';
import { getCategories } from './categories';
import { setRecordCategories } from './recordCategories';
import type { EventStatus, NoteClassification, TaskStatus } from './types';
import { generateId } from '../utils/id';
import { startOfDay } from '../domain/records';

const DAY = 86400000;

const TASK_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed'];
const EVENT_STATUSES: EventStatus[] = ['upcoming', 'in_progress', 'completed', 'cancelled'];
const NOTE_CLASSES: NoteClassification[] = ['important', 'reflection', 'reminder'];
const HABIT_DAYS = ['1111111', '1111100', '1010101'];

function dayAt(offset: number): number {
  return startOfDay(Date.now() + offset * DAY);
}

function hm(hour: number): string {
  return String(hour).padStart(2, '0') + ':00';
}

/**
 * Crea `total` registros de prueba repartidos entre tareas, notas, citas y hábitos.
 * Devuelve el número de registros creados.
 */
export async function seedTestRecords(total = 60): Promise<number> {
  const categoryIds = (await getCategories()).filter((c) => !c.archived).map((c) => c.id);
  const perType = Math.floor(total / 4);
  let created = 0;

  for (let i = 0; i < perType; i++) {
    const offset = (i % 21) - 10;
    const cats = categoryIds.length ? [categoryIds[i % categoryIds.length]] : [];

    const taskStatus = TASK_STATUSES[i % TASK_STATUSES.length];
    const task = await createTask(
      generateId(),
      `Tarea de prueba ${i + 1}`,
      i % 3 === 0 ? undefined : dayAt(offset),
      taskStatus
    );
    if (taskStatus === 'completed') {
      await updateTask(task.id, { completed_at: Date.now() });
    }
    await setRecordCategories(task.id, cats);
    created++;

    const note = await createNote(
      generateId(),
      `Nota de prueba ${i + 1}: texto de ejemplo para revisar la vista de notas.`,
      NOTE_CLASSES[i % NOTE_CLASSES.length]
    );
    await setRecordCategories(note.id, cats);
    created++;

    const startHour = 8 + (i % 10);
    const event = await createEvent(
      generateId(),
      `Cita de prueba ${i + 1}`,
      dayAt(offset),
      hm(startHour),
      dayAt(offset),
      hm(startHour + 1),
      EVENT_STATUSES[i % EVENT_STATUSES.length],
      i % 2 === 0 ? `Sala ${i + 1}` : undefined
    );
    await setRecordCategories(event.id, cats);
    created++;

    const habit = await createHabit(
      generateId(),
      `Hábito de prueba ${i + 1}`,
      dayAt(offset - 5),
      i % 5 !== 0,
      HABIT_DAYS[i % HABIT_DAYS.length]
    );
    await setRecordCategories(habit.id, cats);
    created++;
  }

  return created;
}
