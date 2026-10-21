import { Task, Note, Event, Habit } from '../database/types';

export type TimelineKind = 'task' | 'note' | 'event' | 'habit';

export interface TimelineItem {
  id: string;
  kind: TimelineKind;
  title: string;
  subtitle?: string;
  created_at: number;
  done?: boolean;
}

const CLASSIFICATION_LABELS: Record<string, string> = {
  important: 'Importante',
  anecdote: 'Anécdota',
  reminder: 'Recordatorio',
  reflection: 'Reflexión',
};

export function buildTimeline(
  tasks: Task[],
  notes: Note[],
  events: Event[],
  habits: Habit[]
): TimelineItem[] {
  const items: TimelineItem[] = [
    ...tasks.map((t) => ({
      id: t.id,
      kind: 'task' as const,
      title: t.description,
      subtitle: t.due_date ? 'Vence: ' + new Date(t.due_date).toLocaleDateString('es-ES') : undefined,
      created_at: t.created_at,
      done: t.status === 'completed',
    })),
    ...notes.map((n) => ({
      id: n.id,
      kind: 'note' as const,
      title: n.content,
      subtitle: CLASSIFICATION_LABELS[n.classification] ?? n.classification,
      created_at: n.created_at,
    })),
    ...events.map((e) => ({
      id: e.id,
      kind: 'event' as const,
      title: e.description,
      subtitle:
        new Date(e.start_date).toLocaleDateString('es-ES') +
        ' ' +
        e.start_time +
        '-' +
        e.end_time +
        (e.location ? ' · ' + e.location : ''),
      created_at: e.created_at,
    })),
    ...habits.map((h) => ({
      id: h.id,
      kind: 'habit' as const,
      title: h.name,
      subtitle: h.active ? 'Activo' : 'Inactivo',
      created_at: h.created_at,
    })),
  ];
  return items.sort((a, b) => b.created_at - a.created_at);
}
