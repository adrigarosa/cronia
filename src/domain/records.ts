import type { Event, HabitLog, Habit, Note, Task } from '../database/types';
import type { RecordKind } from '../theme/tokens';

export const STATUS_LABELS: Record<RecordKind, string[]> = {
  T: ['Sin iniciar', 'En progreso', 'Culminada', 'Eliminada'],
  E: ['Próximamente', 'En curso', 'Realizado', 'Cancelado'],
  H: ['Por realizar', 'Realizado', 'No realizado'],
  N: ['Idea', 'Reflexión', 'Nota'],
};

export const TASK_STATUS = ['pending', 'in_progress', 'completed', 'deleted'] as const;
export const EVENT_STATUS = ['upcoming', 'in_progress', 'completed', 'cancelled'] as const;
export const HABIT_STATUS = ['pending', 'completed', 'not_completed'] as const;
export const NOTE_CLASS = ['important', 'reflection', 'reminder'] as const;

export const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const DAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export interface RecordView {
  id: string;
  kind: RecordKind;
  title: string;
  meta: string;
  statusIndex: number;
  date: number;
  dateKey: string;
  created_at: number;
  categoryIds: string[];
  completed_at?: number | null;
}

export interface Source {
  tasks: Task[];
  notes: Note[];
  events: Event[];
  habits: Habit[];
  logs: HabitLog[];
  categoryMap: Record<string, string[]>;
}

export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function dateKey(ts: number): string {
  const d = new Date(ts);
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function sameDay(a: number, b: number): boolean {
  return startOfDay(a) === startOfDay(b);
}

export function weekdayIndex(ts: number): number {
  return (new Date(ts).getDay() + 6) % 7;
}

export function habitPlannedOn(days: string, ts: number): boolean {
  return days.charAt(weekdayIndex(ts)) === '1';
}

export function summarizeDays(days: string): string {
  if (days === '1111111') return 'diario';
  if (days === '1111100') return 'L a V';
  const letters = DAY_LETTERS.filter((_, i) => days.charAt(i) === '1');
  return letters.length ? letters.join(', ') : 'sin días';
}

function shortDate(ts: number): string {
  const d = new Date(ts);
  return d.getDate() + ' ' + MONTHS[d.getMonth()];
}

export function eventBounds(e: Event): { start: number; end: number } {
  const at = (day: number, time: string) => {
    const [h, m] = time.split(':').map(Number);
    return startOfDay(day) + (h * 60 + m) * 60000;
  };
  return { start: at(e.start_date, e.start_time), end: at(e.end_date, e.end_time) };
}

export function eventStatusIndex(e: Event, now: number): number {
  if (e.status === 'completed') return 2;
  if (e.status === 'cancelled') return 3;
  const { start } = eventBounds(e);
  return now < start ? 0 : 1;
}

export function habitStatusIndex(
  habit: Habit,
  key: string,
  logs: HabitLog[],
  todayKey: string
): number {
  const log = logs.find((l) => l.habit_id === habit.id && l.date === key);
  if (log?.status === 'completed') return 1;
  if (log?.status === 'not_completed') return 2;
  return key < todayKey ? 2 : 0;
}

export function nextStatusIndex(kind: RecordKind, current: number): number {
  if (kind === 'E') return current < 2 ? 2 : current === 2 ? 3 : 0;
  return (current + 1) % STATUS_LABELS[kind].length;
}

export function taskMeta(t: Task, statusIdx: number, now: number): string {
  if (statusIdx === 3) return ' · ya no hace falta';
  if (!t.due_date) return ' · sin fecha límite';
  const done = statusIdx === 2;
  if (sameDay(t.due_date, now)) return done ? ' · vencía hoy' : ' · vence hoy';
  const past = startOfDay(t.due_date) < startOfDay(now);
  if (done) return ' · vencía el ' + shortDate(t.due_date);
  return (past ? ' · venció el ' : ' · vence el ') + shortDate(t.due_date);
}

export function eventMeta(e: Event): string {
  return ' · ' + e.start_time + '–' + e.end_time + (e.location ? ' · ' + e.location : '');
}

function taskView(t: Task, now: number, categoryMap: Source['categoryMap']): RecordView {
  const idx = Math.max(0, TASK_STATUS.indexOf(t.status as (typeof TASK_STATUS)[number]));
  const date = t.due_date ?? t.created_at;
  return {
    id: t.id,
    kind: 'T',
    title: t.description,
    meta: taskMeta(t, idx, now),
    statusIndex: idx,
    date,
    dateKey: dateKey(date),
    created_at: t.created_at,
    categoryIds: categoryMap[t.id] ?? [],
    completed_at: t.completed_at,
  };
}

function noteView(n: Note, categoryMap: Source['categoryMap']): RecordView {
  const idx = Math.max(0, NOTE_CLASS.indexOf(n.classification as (typeof NOTE_CLASS)[number]));
  return {
    id: n.id,
    kind: 'N',
    title: n.content,
    meta: '',
    statusIndex: idx,
    date: n.created_at,
    dateKey: dateKey(n.created_at),
    created_at: n.created_at,
    categoryIds: categoryMap[n.id] ?? [],
  };
}

function eventView(e: Event, now: number, categoryMap: Source['categoryMap']): RecordView {
  return {
    id: e.id,
    kind: 'E',
    title: e.description,
    meta: eventMeta(e),
    statusIndex: eventStatusIndex(e, now),
    date: e.start_date,
    dateKey: dateKey(e.start_date),
    created_at: e.created_at,
    categoryIds: categoryMap[e.id] ?? [],
  };
}

function habitView(
  h: Habit,
  day: number,
  logs: HabitLog[],
  now: number,
  categoryMap: Source['categoryMap']
): RecordView {
  const key = dateKey(day);
  return {
    id: h.id,
    kind: 'H',
    title: h.name,
    meta: ' · ' + summarizeDays(h.days),
    statusIndex: habitStatusIndex(h, key, logs, dateKey(now)),
    date: startOfDay(day),
    dateKey: key,
    created_at: h.created_at,
    categoryIds: categoryMap[h.id] ?? [],
  };
}

export function habitActiveOn(h: Habit, day: number): boolean {
  return !!h.active && startOfDay(h.start_date) <= startOfDay(day) && habitPlannedOn(h.days, day);
}

export function recordsOnDay(src: Source, day: number, now: number): RecordView[] {
  const isToday = sameDay(day, now);
  const out: RecordView[] = [];

  for (const t of src.tasks) {
    const view = taskView(t, now, src.categoryMap);
    const carried = isToday && view.statusIndex <= 1 && startOfDay(view.date) < startOfDay(day);
    if (sameDay(view.date, day) || carried) out.push(view);
  }
  for (const n of src.notes) {
    if (sameDay(n.created_at, day)) out.push(noteView(n, src.categoryMap));
  }
  for (const e of src.events) {
    if (sameDay(e.start_date, day)) out.push(eventView(e, now, src.categoryMap));
  }
  for (const h of src.habits) {
    if (habitActiveOn(h, day)) out.push(habitView(h, day, src.logs, now, src.categoryMap));
  }
  return out.sort((a, b) => b.created_at - a.created_at);
}

const MAX_HABIT_HISTORY_DAYS = 120;

export function allRecordViews(src: Source, now: number): RecordView[] {
  const out: RecordView[] = [
    ...src.tasks.map((t) => taskView(t, now, src.categoryMap)),
    ...src.notes.map((n) => noteView(n, src.categoryMap)),
    ...src.events.map((e) => eventView(e, now, src.categoryMap)),
  ];
  const today = startOfDay(now);
  for (const h of src.habits) {
    const from = Math.max(startOfDay(h.start_date), today - MAX_HABIT_HISTORY_DAYS * 86400000);
    for (let day = from; day <= today; day += 86400000) {
      const d = startOfDay(day);
      if (habitActiveOn(h, d)) out.push(habitView(h, d, src.logs, now, src.categoryMap));
    }
  }
  return out;
}

export type StateBucket = 'all' | 'open' | 'done' | 'no';

export function stateBucket(kind: RecordKind, idx: number): StateBucket | 'tag' {
  if (kind === 'N') return 'tag';
  if (kind === 'H') return idx === 0 ? 'open' : idx === 1 ? 'done' : 'no';
  return idx <= 1 ? 'open' : idx === 2 ? 'done' : 'no';
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export interface Filters {
  query: string;
  kind: RecordKind | 'all';
  categoryId: string | 'all';
  state: StateBucket;
  from?: number | null;
  to?: number | null;
}

export function filterRecords(records: RecordView[], f: Filters): RecordView[] {
  const q = normalize(f.query.trim());
  return records
    .filter((r) => {
      if (f.kind !== 'all' && r.kind !== f.kind) return false;
      if (f.categoryId !== 'all' && !r.categoryIds.includes(f.categoryId)) return false;
      if (f.state !== 'all' && stateBucket(r.kind, r.statusIndex) !== f.state) return false;
      if (f.from != null && startOfDay(r.date) < startOfDay(f.from)) return false;
      if (f.to != null && startOfDay(r.date) > startOfDay(f.to)) return false;
      if (q && !normalize(r.title).includes(q)) return false;
      return true;
    })
    .sort((a, b) => b.date - a.date || b.created_at - a.created_at);
}
