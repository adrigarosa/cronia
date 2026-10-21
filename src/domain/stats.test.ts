import { describe, it, expect } from 'vitest';
import { computeStats, rangeOf, StatsData } from './stats';
import { startOfDay, Source } from './records';
import type { Event, Habit, HabitLog, Note, Task } from '../database/types';

const NOW = new Date(2026, 9, 22, 12, 0, 0).getTime(); // jueves 22 oct 2026
const TODAY = startOfDay(NOW);
const day = (n: number) => startOfDay(new Date(2026, 9, n).getTime());

function task(id: string, over: Partial<Task>): Task {
  return {
    id,
    type: 'task',
    description: id,
    due_date: null,
    status: 'pending',
    completed_at: null,
    created_at: day(17),
    updated_at: day(17),
    deleted: false,
    ...over,
  };
}

function note(id: string, created: number): Note {
  return {
    id,
    type: 'note',
    content: id,
    classification: 'reminder',
    created_at: created,
    updated_at: created,
    deleted: false,
  };
}

function event(id: string, start: number, status: Event['status']): Event {
  return {
    id,
    type: 'event',
    description: id,
    start_date: start,
    start_time: '09:00',
    end_date: start,
    end_time: '10:00',
    location: null,
    status,
    created_at: start,
    updated_at: start,
    deleted: false,
  };
}

const HABIT: Habit = {
  id: 'h1',
  type: 'habit',
  name: 'Leer',
  start_date: day(1),
  active: true,
  days: '1111111',
  created_at: day(1),
  updated_at: day(1),
  deleted: false,
};

function log(id: string, date: number, status: HabitLog['status']): HabitLog {
  return { id, habit_id: 'h1', date: dateKeyOf(date), status, created_at: date, updated_at: date };
}

function dateKeyOf(ts: number): string {
  const d = new Date(ts);
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

function source(): Source {
  return {
    tasks: [
      task('t1', { due_date: day(20) }),
      task('t2', { due_date: day(18), status: 'completed', completed_at: day(19) }),
      task('t3', { due_date: day(21), status: 'in_progress' }),
      task('t4', { created_at: TODAY }),
      task('t5', { due_date: day(21), status: 'deleted' }),
    ],
    notes: [note('n1', TODAY)],
    events: [
      event('e1', day(20), 'completed'),
      event('e2', day(21), 'cancelled'),
      event('e3', day(22), 'upcoming'),
    ],
    habits: [HABIT],
    logs: [log('l1', day(20), 'completed'), log('l2', day(21), 'not_completed')],
    categoryMap: { t1: ['home'], n1: ['work'], e1: ['home'] },
  };
}

function week(s: Source = source()): StatsData {
  return computeStats(s, 'week', NOW);
}

describe('rangeOf', () => {
  it('del día, semana (7 días), mes y año', () => {
    expect(rangeOf('day', NOW)).toEqual({ from: TODAY, to: TODAY });
    expect(rangeOf('week', NOW)).toEqual({ from: day(16), to: TODAY });
    expect(rangeOf('month', NOW).from).toBe(day(1));
    expect(rangeOf('year', NOW).from).toBe(startOfDay(new Date(2026, 0, 1).getTime()));
  });
});

describe('computeStats · semana', () => {
  const s = week();

  it('mezcla por tipo y total del periodo', () => {
    expect(s.mix).toEqual({ T: 5, E: 3, N: 1, H: 7 });
    expect(s.total).toBe(16);
    expect(s.periodLabel).toBe('16 – 22 oct 2026');
  });

  it('tareas: creadas, culminadas, estados y delta', () => {
    expect(s.tasks.created).toBe(5);
    expect(s.tasks.completed).toBe(1);
    expect(s.tasks.inProgress).toBe(1);
    expect(s.tasks.pending).toBe(2); // t1 y t4
    expect(s.tasks.deleted).toBe(1);
    expect(s.tasks.deltaCompleted).toBe(1);
    expect(s.tasks.deltaLabel).toBe('+1 culminadas vs. semana anterior');
  });

  it('citas: realizadas, canceladas y abiertas', () => {
    expect(s.events).toEqual({ done: 1, cancelled: 1, open: 1 });
  });

  it('hábitos: previstos, realizados, no realizados, abiertos y %', () => {
    expect(s.habits.plan).toBe(7);
    expect(s.habits.done).toBe(1);
    expect(s.habits.miss).toBe(5);
    expect(s.habits.open).toBe(1); // hoy sin registro
    expect(s.habits.pct).toBe(17); // 1 de 6 cerrados
  });

  it('serie diaria: 7 barras con hoy resaltado', () => {
    expect(s.series).toHaveLength(7);
    expect(s.series[6].current).toBe(true);
    expect(s.series.slice(0, 6).every((b) => !b.current)).toBe(true);
    const oct20 = s.series[4];
    expect(oct20.label).toBe('M 20');
    expect(oct20.counts).toEqual({ T: 1, E: 1, N: 0, H: 1 });
    expect(oct20.total).toBe(3);
    expect(s.weekLabels[6]).toBe('J'); // jueves
  });

  it('rejilla de hábitos: estados por día', () => {
    expect(s.habitGrid).toHaveLength(1);
    expect(s.habitGrid[0].cells.map((c) => c.status)).toEqual([
      'miss', 'miss', 'miss', 'miss', 'done', 'miss', 'open',
    ]);
  });

  it('calendario del mes: niveles pasados, hoy marcado, futuro vacío', () => {
    expect(s.calendar).toHaveLength(31);
    expect(s.calendarMonth).toBe('octubre');
    expect(s.calendarBlanks).toBe(3); // 1 oct 2026 cae en jueves (L M X _ J)
    expect(s.calendar[19]).toEqual({ day: 20, level: 1, today: false });
    expect(s.calendar[21]).toEqual({ day: 22, level: 0, today: true });
    expect(s.calendar[22].level).toBeNull();
    expect(s.calendar[30].level).toBeNull();
  });

  it('categorías ordenadas de mayor a menor', () => {
    expect(s.cats).toEqual([
      { id: 'home', v: 2 },
      { id: 'work', v: 1 },
    ]);
  });
});

describe('computeStats · otros periodos', () => {
  it('día: etiqueta con día de la semana', () => {
    const s = computeStats(source(), 'day', NOW);
    expect(s.periodLabel).toBe('Jueves, 22 oct');
    expect(s.seriesLabel).toBe('Últimos 7 días · hoy resaltado');
  });

  it('mes: series por semana con la semana actual resaltada', () => {
    const s = computeStats(source(), 'month', NOW);
    expect(s.periodLabel).toBe('octubre 2026 (al día 22)');
    expect(s.seriesLabel).toBe('Por semana');
    expect(s.series.map((b) => b.label)).toEqual(['1–7', '8–14', '15–21', '22–28', '29–31']);
    expect(s.series[3].current).toBe(true);
  });

  it('año: series por mes hasta el mes actual', () => {
    const s = computeStats(source(), 'year', NOW);
    expect(s.periodLabel).toBe('2026 (enero – octubre)');
    expect(s.series).toHaveLength(10);
    expect(s.series[9].current).toBe(true);
    expect(s.series[9].counts.H).toBe(22); // hábito diario del 1 al 22
  });

  it('sin datos de hábito el porcentaje es null', () => {
    const empty: Source = { tasks: [], notes: [], events: [], habits: [], logs: [], categoryMap: {} };
    expect(week(empty).habits.pct).toBeNull();
    expect(week(empty).total).toBe(0);
  });

  it('hábito inactivo no aporta días previstos', () => {
    const s = source();
    s.habits = [{ ...HABIT, active: false }];
    expect(week(s).mix.H).toBe(0);
    expect(week(s).habitGrid).toHaveLength(0);
  });
});
