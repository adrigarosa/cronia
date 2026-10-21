import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  getTasks,
  getNotes,
  getEvents,
  getHabits,
  completeTask,
  deleteTask,
  deleteNote,
  deleteEvent,
  deleteHabit,
} from '../database';
import { buildTimeline, TimelineItem, TimelineKind } from '../utils/timeline';

export function useTimeline() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [tasks, notes, events, habits] = await Promise.all([
        getTasks(),
        getNotes(),
        getEvents(),
        getHabits(),
      ]);
      setItems(buildTimeline(tasks, notes, events, habits));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const complete = useCallback(
    async (id: string) => {
      await completeTask(id);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (kind: TimelineKind, id: string) => {
      const deleters = {
        task: deleteTask,
        note: deleteNote,
        event: deleteEvent,
        habit: deleteHabit,
      };
      await deleters[kind](id);
      await refresh();
    },
    [refresh]
  );

  return { items, loading, error, refresh, complete, remove };
}
