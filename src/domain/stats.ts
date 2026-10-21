import type { RecordKind } from '../theme/tokens';
import {
  dateKey,
  habitActiveOn,
  habitStatusIndex,
  Source,
  startOfDay,
  weekdayIndex,
} from './records';

export type Period = 'day' | 'week' | 'month' | 'year';

export const PERIOD_LABELS: Record<Period, string> = {
  day: 'Día',
  week: 'Semana',
  month: 'Mes',
  year: 'Año',
};

export const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const MONTHS_FULL = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const DAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']; // por getDay()

const DAY_MS = 86400000;

export interface Range {
  from: number;
  to: number;
}

export interface SeriesBucket {
  label: string;
  counts: Record<RecordKind, number>;
  total: number;
  current: boolean;
}

export interface HabitCell {
  day: number;
  status: 'done' | 'miss' | 'open' | 'none';
}

export interface HabitGridRow {
  id: string;
  name: string;
  cells: HabitCell[];
}

export interface CalendarDay {
  day: number;
  level: number | null; // hábitos realizados ese día (0..3+), null = futuro
  today: boolean;
}

export interface StatsData {
  periodLabel: string;
  seriesLabel: string;
  mix: Record<RecordKind, number>;
  total: number;
  series: SeriesBucket[];
  tasks: {
    created: number;
    completed: number;
    inProgress: number;
    pending: number;
    deleted: number;
    deltaCompleted: number;
    deltaLabel: string;
  };
  events: { done: number; cancelled: number; open: number };
  habits: { plan: number; done: number; miss: number; open: number; pct: number | null };
  habitGrid: HabitGridRow[];
  weekLabels: string[];
  calendar: CalendarDay[];
  calendarMonth: string;
  calendarBlanks: number;
  cats: { id: string; v: number }[];
}

export function rangeOf(period: Period, now: number): Range {
  const today = startOfDay(now);
  if (period === 'day') return { from: today, to: today };
  if (period === 'week') return { from: today - 6 * DAY_MS, to: today };
  if (period === 'month') {
    const d = new Date(today);
    return { from: new Date(d.getFullYear(), d.getMonth(), 1).getTime(), to: today };
  }
  const d = new Date(today);
  return { from: new Date(d.getFullYear(), 0, 1).getTime(), to: today };
}

function prevRangeOf(period: Period, now: number): Range {
  const cur = rangeOf(period, now);
  if (period === 'day') return { from: cur.from - DAY_MS, to: cur.to - DAY_MS };
  if (period === 'week') return { from: cur.from - 7 * DAY_MS, to: cur.to - 7 * DAY_MS };
  if (period === 'month') {
    const d = new Date(cur.from);
    return {
      from: new Date(d.getFullYear(), d.getMonth() - 1, 1).getTime(),
      to: new Date(d.getFullYear(), d.getMonth() + 1, 0).getTime(),
    };
  }
  const d = new Date(cur.from);
  return {
    from: new Date(d.getFullYear() - 1, 0, 1).getTime(),
    to: new Date(d.getFullYear() - 1, 11, 31).getTime(),
  };
}

function inRange(ts: number, r: Range): boolean {
  return ts >= r.from && ts <= r.to;
}

/** Fecha representativa de un registro para estadísticas */
export function recordDate(src: Source, kind: RecordKind, id: string): number | null {
  if (kind === 'T') return src.tasks.find((t) => t.id === id)?.due_date ?? null;
  if (kind === 'N') return src.notes.find((n) => n.id === id)?.created_at ?? null;
  if (kind === 'E') return src.events.find((e) => e.id === id)?.start_date ?? null;
  return null;
}

interface HabitDayCount {
  plan: number;
  done: number;
  miss: number;
  open: number;
}

function habitDaysIn(src: Source, r: Range, now: number): HabitDayCount {
  const out: HabitDayCount = { plan: 0, done: 0, miss: 0, open: 0 };
  const today = startOfDay(now);
  const todayKey = dateKey(now);
  for (const h of src.habits) {
    if (!h.active) continue;
    const from = Math.max(startOfDay(h.start_date), r.from);
    for (let day = from; day <= Math.min(r.to, today); day += DAY_MS) {
      const d = startOfDay(day);
      if (!habitActiveOn(h, d)) continue;
      out.plan++;
      const idx = habitStatusIndex(h, dateKey(d), src.logs, todayKey);
      if (idx === 1) out.done++;
      else if (idx === 2) out.miss++;
      else out.open++;
    }
  }
  return out;
}

function periodLabelOf(period: Period, r: Range, now: number): string {
  const from = new Date(r.from);
  const to = new Date(r.to);
  if (period === 'day') {
    const d = new Date(now);
    return capitalizeDay(d) + ', ' + d.getDate() + ' ' + MONTHS_SHORT[d.getMonth()];
  }
  if (period === 'week') {
    return (
      from.getDate() + ' – ' + to.getDate() + ' ' + MONTHS_SHORT[to.getMonth()] + ' ' + to.getFullYear()
    );
  }
  if (period === 'month') {
    return (
      MONTHS_FULL[to.getMonth()] + ' ' + to.getFullYear() + ' (al día ' + to.getDate() + ')'
    );
  }
  return to.getFullYear() + ' (enero – ' + MONTHS_FULL[to.getMonth()] + ')';
}

const WEEKDAY_FULL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function capitalizeDay(d: Date): string {
  const wd = WEEKDAY_FULL[d.getDay()];
  return wd.charAt(0).toUpperCase() + wd.slice(1);
}

function buildSeries(period: Period, src: Source, r: Range, now: number): SeriesBucket[] {
  const today = startOfDay(now);
  const countsOn = (day: number): Record<RecordKind, number> => {
    const d = startOfDay(day);
    const key = dateKey(d);
    const counts: Record<RecordKind, number> = { T: 0, E: 0, N: 0, H: 0 };
    for (const t of src.tasks) {
      if (dateKey(t.due_date ?? t.created_at) === key) counts.T++;
    }
    for (const n of src.notes) {
      if (dateKey(n.created_at) === key) counts.N++;
    }
    for (const e of src.events) {
      if (dateKey(e.start_date) === key) counts.E++;
    }
    for (const h of src.habits) {
      if (habitActiveOn(h, d)) counts.H++;
    }
    return counts;
  };

  if (period === 'day' || period === 'week') {
    const out: SeriesBucket[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = startOfDay(today - i * DAY_MS);
      const counts = countsOn(d);
      const dt = new Date(d);
      out.push({
        label: DAY_LETTERS[dt.getDay()] + ' ' + dt.getDate(),
        counts,
        total: counts.T + counts.E + counts.N + counts.H,
        current: d === today,
      });
    }
    return out;
  }

  if (period === 'month') {
    const out: SeriesBucket[] = [];
    const first = new Date(r.to);
    first.setDate(1);
    let day = 1;
    const totalDays = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    while (day <= totalDays) {
      const end = Math.min(day + 6, totalDays);
      const from = new Date(first.getFullYear(), first.getMonth(), day).getTime();
      const to = new Date(first.getFullYear(), first.getMonth(), end).getTime();
      const sub: Range = { from, to };
      const counts = sumCounts(src, sub, today);
      out.push({
        label: day + '–' + end,
        counts,
        total: counts.T + counts.E + counts.N + counts.H,
        current: inRange(today, sub),
      });
      day = end + 1;
    }
    return out;
  }

  const out: SeriesBucket[] = [];
  const year = new Date(r.to).getFullYear();
  const curMonth = new Date(today).getMonth();
  for (let m = 0; m <= curMonth; m++) {
    const sub: Range = {
      from: new Date(year, m, 1).getTime(),
      to: new Date(year, m + 1, 0).getTime(),
    };
    const counts = sumCounts(src, sub, today);
    out.push({
      label: MONTHS_SHORT[m].charAt(0).toUpperCase(),
      counts,
      total: counts.T + counts.E + counts.N + counts.H,
      current: m === curMonth,
    });
  }
  return out;
}

function sumCounts(src: Source, r: Range, today: number): Record<RecordKind, number> {
  const counts: Record<RecordKind, number> = { T: 0, E: 0, N: 0, H: 0 };
  for (const t of src.tasks) {
    if (inRange(t.due_date ?? t.created_at, r)) counts.T++;
  }
  for (const n of src.notes) {
    if (inRange(n.created_at, r)) counts.N++;
  }
  for (const e of src.events) {
    if (inRange(e.start_date, r)) counts.E++;
  }
  counts.H = habitDaysIn(src, r, today).plan;
  return counts;
}

const DELTA_LABEL: Record<Period, string> = {
  day: 'culminadas vs. ayer',
  week: 'culminadas vs. semana anterior',
  month: 'culminadas vs. mes anterior',
  year: 'culminadas vs. año anterior',
};

export function computeStats(src: Source, period: Period, now: number): StatsData {
  const r = rangeOf(period, now);
  const prev = prevRangeOf(period, now);
  const today = startOfDay(now);
  const todayKey = dateKey(now);

  const mix: Record<RecordKind, number> = sumCounts(src, r, today);
  const total = mix.T + mix.E + mix.N + mix.H;

  // Tareas
  let created = 0;
  let completed = 0;
  let inProgress = 0;
  let pending = 0;
  let deleted = 0;
  for (const t of src.tasks) {
    const date = t.due_date ?? t.created_at;
    if (inRange(t.created_at, r)) created++;
    if (t.status === 'deleted' && inRange(date, r)) deleted++;
    if (t.status === 'in_progress' && inRange(date, r)) inProgress++;
    if (t.status === 'pending' && inRange(date, r)) pending++;
    const doneAt = t.completed_at ?? (t.status === 'completed' ? date : null);
    if (doneAt != null && inRange(doneAt, r)) completed++;
  }
  let prevCompleted = 0;
  for (const t of src.tasks) {
    const doneAt = t.completed_at ?? (t.status === 'completed' ? (t.due_date ?? t.created_at) : null);
    if (doneAt != null && inRange(doneAt, prev)) prevCompleted++;
  }
  const deltaCompleted = completed - prevCompleted;

  // Citas
  let evDone = 0;
  let evCancelled = 0;
  let evOpen = 0;
  for (const e of src.events) {
    if (!inRange(e.start_date, r)) continue;
    if (e.status === 'completed') evDone++;
    else if (e.status === 'cancelled') evCancelled++;
    else evOpen++;
  }

  // Hábitos
  const hb = habitDaysIn(src, r, now);
  const evalDays = hb.done + hb.miss;
  const pct = evalDays > 0 ? Math.round((hb.done / evalDays) * 100) : null;

  // Rejilla de últimos 7 días
  const weekLabels: string[] = [];
  const weekDays: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = startOfDay(today - i * DAY_MS);
    weekDays.push(d);
    weekLabels.push(DAY_LETTERS[new Date(d).getDay()]);
  }
  const habitGrid: HabitGridRow[] = [];
  for (const h of src.habits) {
    if (!h.active) continue;
    const cells: HabitCell[] = weekDays.map((d) => {
      if (!habitActiveOn(h, d)) return { day: d, status: 'none' };
      const idx = habitStatusIndex(h, dateKey(d), src.logs, todayKey);
      return { day: d, status: idx === 1 ? 'done' : idx === 2 ? 'miss' : 'open' };
    });
    if (cells.some((c) => c.status !== 'none')) {
      habitGrid.push({ id: h.id, name: h.name, cells });
    }
  }

  // Calendario del mes actual
  const monthStart = new Date(today);
  monthStart.setDate(1);
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const calendar: CalendarDay[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = startOfDay(new Date(monthStart.getFullYear(), monthStart.getMonth(), day).getTime());
    if (d > today) {
      calendar.push({ day, level: null, today: false });
      continue;
    }
    let level = 0;
    for (const h of src.habits) {
      if (!habitActiveOn(h, d)) continue;
      if (habitStatusIndex(h, dateKey(d), src.logs, todayKey) === 1) level++;
    }
    calendar.push({ day, level, today: d === today });
  }

  // Categorías (registros del periodo; los hábitos cuentan una vez)
  const counts: Record<string, number> = {};
  const bump = (ids: string[]) => {
    for (const id of ids) counts[id] = (counts[id] ?? 0) + 1;
  };
  for (const t of src.tasks) {
    const date = t.due_date ?? t.created_at;
    if (inRange(date, r) || inRange(t.created_at, r)) bump(src.categoryMap[t.id] ?? []);
  }
  for (const n of src.notes) {
    if (inRange(n.created_at, r)) bump(src.categoryMap[n.id] ?? []);
  }
  for (const e of src.events) {
    if (inRange(e.start_date, r)) bump(src.categoryMap[e.id] ?? []);
  }
  for (const h of src.habits) {
    if (!h.active) continue;
    const anyDay = habitDaysIn(src, { from: Math.max(startOfDay(h.start_date), r.from), to: r.to }, now);
    if (anyDay.plan > 0) bump(src.categoryMap[h.id] ?? []);
  }

  const seriesLabel =
    period === 'day'
      ? 'Últimos 7 días · hoy resaltado'
      : period === 'week'
        ? 'Por día'
        : period === 'month'
          ? 'Por semana'
          : 'Por mes';

  return {
    periodLabel: periodLabelOf(period, r, now),
    seriesLabel,
    mix,
    total,
    series: buildSeries(period, src, r, now),
    tasks: {
      created,
      completed,
      inProgress,
      pending,
      deleted,
      deltaCompleted,
      deltaLabel:
        (deltaCompleted >= 0 ? '+' : '−') +
        Math.abs(deltaCompleted) +
        ' ' +
        DELTA_LABEL[period],
    },
    events: { done: evDone, cancelled: evCancelled, open: evOpen },
    habits: { plan: hb.plan, done: hb.done, miss: hb.miss, open: hb.open, pct },
    habitGrid,
    weekLabels,
    calendar,
    calendarMonth: MONTHS_FULL[monthStart.getMonth()],
    calendarBlanks: weekdayIndex(monthStart.getTime()),
    cats: Object.entries(counts)
      .map(([id, v]) => ({ id, v }))
      .sort((a, b) => b.v - a.v),
  };
}
