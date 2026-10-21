import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  getTasks,
  getNotes,
  getEvents,
  getHabits,
  getAllHabitLogs,
  getRecordCategoryMap,
  getCategories,
  updateTask,
  updateNote,
  updateEvent,
  deleteTask,
  deleteNote,
  deleteEvent,
  deleteHabit,
  setHabitDayStatus,
} from '../database';
import type { Category } from '../database/types';
import type { RecordKind } from '../theme/tokens';
import type { Source, RecordView } from '../domain/records';
import {
  nextStatusIndex,
  TASK_STATUS,
  EVENT_STATUS,
  HABIT_STATUS,
  NOTE_CLASS,
} from '../domain/records';
import { generateId } from '../utils/id';

const EMPTY: Source = { tasks: [], notes: [], events: [], habits: [], logs: [], categoryMap: {} };

/**
 * Carga todos los registros (tareas, notas, citas, hábitos + logs y categorías)
 * y ofrece las acciones del diseño: ciclar estado, borrar y recargar.
 */
export function useRecords() {
  const [source, setSource] = useState<Source>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setError(null);
      const [tasks, notes, events, habits, logs, categoryMap, cats] = await Promise.all([
        getTasks(),
        getNotes(),
        getEvents(),
        getHabits(),
        getAllHabitLogs(),
        getRecordCategoryMap(),
        getCategories(),
      ]);
      setSource({ tasks, notes, events, habits, logs, categoryMap });
      setCategories(cats);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const cycleStatus = useCallback(
    async (view: RecordView) => {
      const next = nextStatusIndex(view.kind, view.statusIndex);
      const kind: RecordKind = view.kind;
      if (kind === 'T') {
        await updateTask(view.id, {
          status: TASK_STATUS[next],
          completed_at: next === 2 ? Date.now() : null,
        });
      } else if (kind === 'E') {
        await updateEvent(view.id, { status: EVENT_STATUS[next] });
      } else if (kind === 'H') {
        await setHabitDayStatus(generateId(), view.id, view.dateKey, HABIT_STATUS[next]);
      } else {
        await updateNote(view.id, { classification: NOTE_CLASS[next] });
      }
      await reload();
    },
    [reload]
  );

  const remove = useCallback(
    async (kind: RecordKind, id: string) => {
      const deleters = { T: deleteTask, N: deleteNote, E: deleteEvent, H: deleteHabit };
      await deleters[kind](id);
      await reload();
    },
    [reload]
  );

  return { source, categories, loading, error, reload, cycleStatus, remove };
}
