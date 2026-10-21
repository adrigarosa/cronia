import { describe, it, expect } from 'vitest';
import {
  dateKey,
  startOfDay,
  weekdayIndex,
  habitPlannedOn,
  summarizeDays,
  eventBounds,
  eventStatusIndex,
  habitStatusIndex,
  habitActiveOn,
  nextStatusIndex,
  taskMeta,
  eventMeta,
  recordsOnDay,
  allRecordViews,
  filterRecords,
  normalize,
  stateBucket,
  Source,
} from './records';
import type { Event, Habit, HabitLog, Note, Task } from '../database/types';

const NOW = new Date(2026, 9, 22, 10, 0, 0).getTime(); // miércoles 22 oct 2026, 10:00
const TODAY = startOfDay(NOW);
const KEY = dateKey(NOW); // '2026-10-22'

function task(over: Partial<Task> = {}): Task {
  return {
    id: 't1',
    type: 'task',
    description: 'Comprar pan',
    due_date: null,
    status: 'pending',
    completed_at: null,
    created_at: NOW,
    updated_at: NOW,
    deleted: false,
    ...over,
  };
}

function note(over: Partial<Note> = {}): Note {
  return {
    id: 'n1',
    type: 'note',
    content: 'Idea de proyecto',
    classification: 'important',
    created_at: NOW,
    updated_at: NOW,
    deleted: false,
    ...over,
  };
}

function event(over: Partial<Event> = {}): Event {
  return {
    id: 'e1',
    type: 'event',
    description: 'Médico',
    start_date: TODAY,
    start_time: '16:00',
    end_date: TODAY,
    end_time: '17:00',
    location: null,
    status: 'upcoming',
    created_at: NOW,
    updated_at: NOW,
    deleted: false,
    ...over,
  };
}

function habit(over: Partial<Habit> = {}): Habit {
  return {
    id: 'h1',
    type: 'habit',
    name: 'Leer',
    start_date: TODAY,
    active: true,
    days: '1111111',
    created_at: NOW,
    updated_at: NOW,
    deleted: false,
    ...over,
  };
}

function log(over: Partial<HabitLog> = {}): HabitLog {
  return {
    id: 'l1',
    habit_id: 'h1',
    date: KEY,
    status: 'completed',
    created_at: NOW,
    updated_at: NOW,
    ...over,
  };
}

function src(over: Partial<Source> = {}): Source {
  return { tasks: [], notes: [], events: [], habits: [], logs: [], categoryMap: {}, ...over };
}

describe('fechas', () => {
  it('dateKey usa formato YYYY-MM-DD local', () => {
    expect(KEY).toBe('2026-10-22');
  });

  it('weekdayIndex empieza en lunes = 0', () => {
    expect(weekdayIndex(TODAY)).toBe(3); // jueves
    expect(weekdayIndex(startOfDay(new Date(2026, 9, 26).getTime()))).toBe(0); // lunes 26
  });

  it('startOfDay elimina la hora', () => {
    expect(startOfDay(NOW + 3600000)).toBe(TODAY);
  });
});

describe('hábitos: días previstos', () => {
  it('habitPlannedOn lee la cadena 1111111 por posición', () => {
    expect(habitPlannedOn('1000000', TODAY)).toBe(false); // solo lunes
    expect(habitPlannedOn('0001000', TODAY)).toBe(true); // jueves
  });

  it('summarizeDays resume diario, L-V y letras sueltas', () => {
    expect(summarizeDays('1111111')).toBe('diario');
    expect(summarizeDays('1111100')).toBe('L a V');
    expect(summarizeDays('0000011')).toBe('S, D');
    expect(summarizeDays('0000000')).toBe('sin días');
  });

  it('habitActiveOn exige activo, inicio pasado y día previsto', () => {
    expect(habitActiveOn(habit(), TODAY)).toBe(true);
    expect(habitActiveOn(habit({ active: false }), TODAY)).toBe(false);
    expect(habitActiveOn(habit({ start_date: TODAY + 86400000 }), TODAY)).toBe(false);
    expect(habitActiveOn(habit({ days: '1000000' }), TODAY)).toBe(false);
  });
});

describe('estados', () => {
  it('evento: antes del inicio es Próximamente, dentro En curso', () => {
    expect(eventStatusIndex(event(), NOW)).toBe(0);
    expect(eventStatusIndex(event(), new Date(2026, 9, 22, 16, 30).getTime())).toBe(1);
  });

  it('evento: completado o cancelado en BD gana sobre el cálculo', () => {
    expect(eventStatusIndex(event({ status: 'completed' }), NOW)).toBe(2);
    expect(eventStatusIndex(event({ status: 'cancelled' }), NOW)).toBe(3);
  });

  it('eventBounds combina fecha y hora', () => {
    const b = eventBounds(event());
    expect(b.start).toBe(TODAY + 16 * 3600000);
    expect(b.end).toBe(TODAY + 17 * 3600000);
  });

  it('hábito del día: log manda; día pasado sin log = no realizado; hoy sin log = por realizar', () => {
    expect(habitStatusIndex(habit(), KEY, [log()], KEY)).toBe(1);
    expect(habitStatusIndex(habit(), KEY, [log({ status: 'not_completed' })], KEY)).toBe(2);
    expect(habitStatusIndex(habit(), KEY, [], KEY)).toBe(0);
    expect(habitStatusIndex(habit(), '2026-10-21', [], KEY)).toBe(2);
  });

  it('nextStatusIndex: tareas y notas ciclan; eventos saltan a realizados', () => {
    expect(nextStatusIndex('T', 0)).toBe(1);
    expect(nextStatusIndex('T', 1)).toBe(2);
    expect(nextStatusIndex('T', 2)).toBe(3);
    expect(nextStatusIndex('T', 3)).toBe(0);
    expect(nextStatusIndex('E', 0)).toBe(2);
    expect(nextStatusIndex('E', 2)).toBe(3);
    expect(nextStatusIndex('E', 3)).toBe(0);
    expect(nextStatusIndex('N', 2)).toBe(0);
    expect(nextStatusIndex('H', 2)).toBe(0);
  });

  it('stateBucket clasifica por tipo', () => {
    expect(stateBucket('T', 0)).toBe('open');
    expect(stateBucket('T', 2)).toBe('done');
    expect(stateBucket('T', 3)).toBe('no');
    expect(stateBucket('H', 0)).toBe('open');
    expect(stateBucket('H', 2)).toBe('no');
    expect(stateBucket('N', 0)).toBe('tag');
  });
});

describe('metadatos', () => {
  it('taskMeta describe vencimiento relativo a hoy', () => {
    expect(taskMeta(task(), 0, NOW)).toBe(' · sin fecha límite');
    expect(taskMeta(task({ due_date: TODAY }), 0, NOW)).toBe(' · vence hoy');
    expect(taskMeta(task({ due_date: TODAY }), 2, NOW)).toBe(' · vencía hoy');
    expect(taskMeta(task({ due_date: TODAY - 86400000 }), 0, NOW)).toBe(' · venció el 21 oct');
    expect(taskMeta(task({ due_date: TODAY - 86400000 }), 2, NOW)).toBe(' · vencía el 21 oct');
    expect(taskMeta(task({ due_date: TODAY + 86400000 }), 0, NOW)).toBe(' · vence el 23 oct');
    expect(taskMeta(task(), 3, NOW)).toBe(' · ya no hace falta');
  });

  it('eventMeta muestra horario y lugar opcional', () => {
    expect(eventMeta(event())).toBe(' · 16:00–17:00');
    expect(eventMeta(event({ location: 'Clínica' }))).toBe(' · 16:00–17:00 · Clínica');
  });
});

describe('recordsOnDay', () => {
  it('incluye tareas del día y arrastra vencidas pendientes solo en hoy', () => {
    const overdue = task({ id: 't2', due_date: TODAY - 86400000 });
    const todayTask = task({ id: 't1', due_date: TODAY });
    const done = task({ id: 't3', due_date: TODAY - 86400000, status: 'completed' });

    const hoy = recordsOnDay(src({ tasks: [overdue, todayTask, done] }), TODAY, NOW);
    expect(hoy.map((r) => r.id).sort()).toEqual(['t1', 't2']);

    const manana = recordsOnDay(src({ tasks: [overdue, todayTask, done] }), TODAY + 86400000, NOW);
    expect(manana.map((r) => r.id)).toEqual([]);
  });

  it('notas por fecha de creación, eventos por fecha de inicio', () => {
    const items = recordsOnDay(
      src({ notes: [note()], events: [event()] }),
      TODAY,
      NOW
    );
    expect(items.map((r) => r.kind).sort()).toEqual(['E', 'N']);
  });

  it('hábitos aparecen solo en días previstos y con estado del log', () => {
    const h = habit({ days: '0001000' }); // solo jueves
    const saturday = TODAY + 2 * 86400000;
    expect(recordsOnDay(src({ habits: [h] }), saturday, NOW)).toHaveLength(0);

    const withLog = recordsOnDay(src({ habits: [h], logs: [log()] }), TODAY, NOW);
    expect(withLog[0].statusIndex).toBe(1);
    expect(withLog[0].meta).toBe(' · J');
  });
});

describe('allRecordViews', () => {
  it('expande hábitos por día desde start_date, con tope de 120 días', () => {
    const long = habit({ id: 'hx', start_date: TODAY - 400 * 86400000 });
    const views = allRecordViews(src({ habits: [long] }), NOW);
    expect(views).toHaveLength(121); // tope 120 días + hoy
  });
});

describe('filterRecords', () => {
  const records = allRecordViews(
    src({
      tasks: [task({ id: 't1', description: 'Comprar pan' }), task({ id: 't2', description: 'Regar plantas', status: 'completed' })],
      notes: [note({ id: 'n1', content: 'Idea de volar' })],
      events: [event({ id: 'e1' })],
      habits: [habit({ id: 'h1' })],
      categoryMap: { t1: ['home'] },
    }),
    NOW
  );

  it('filtra por tipo', () => {
    expect(filterRecords(records, { query: '', kind: 'T', categoryId: 'all', state: 'all' })).toHaveLength(2);
    expect(filterRecords(records, { query: '', kind: 'H', categoryId: 'all', state: 'all' })).toHaveLength(1);
  });

  it('filtra por categoría', () => {
    const res = filterRecords(records, { query: '', kind: 'all', categoryId: 'home', state: 'all' });
    expect(res.map((r) => r.id)).toEqual(['t1']);
  });

  it('filtra por estado con buckets', () => {
    const open = filterRecords(records, { query: '', kind: 'all', categoryId: 'all', state: 'open' });
    expect(open.map((r) => r.id).sort()).toEqual(['e1', 'h1', 't1']);
    const done = filterRecords(records, { query: '', kind: 'all', categoryId: 'all', state: 'done' });
    expect(done.map((r) => r.id)).toEqual(['t2']);
    const no = filterRecords(records, { query: '', kind: 'all', categoryId: 'all', state: 'no' });
    expect(no.map((r) => r.id)).toEqual([]);
  });

  it('la búsqueda ignora mayúsculas y tildes', () => {
    const res = filterRecords(records, { query: 'PLANTAS', kind: 'all', categoryId: 'all', state: 'all' });
    expect(res.map((r) => r.id)).toEqual(['t2']);
    const res2 = filterRecords(records, { query: 'volar', kind: 'all', categoryId: 'all', state: 'all' });
    expect(res2.map((r) => r.id)).toEqual(['n1']);
  });

  it('filtra por rango de fechas y ordena de más reciente a más antiguo', () => {
    const old = task({ id: 'tOld', due_date: TODAY - 5 * 86400000 });
    const list = allRecordViews(src({ tasks: [task(), old] }), NOW);
    const res = filterRecords(list, {
      query: '',
      kind: 'T',
      categoryId: 'all',
      state: 'all',
      from: TODAY,
      to: TODAY,
    });
    expect(res.map((r) => r.id)).toEqual(['t1']);
    const all = filterRecords(list, { query: '', kind: 'T', categoryId: 'all', state: 'all' });
    expect(all[0].id).toBe('t1');
  });
});

describe('normalize', () => {
  it('quita tildes y pasa a minúsculas', () => {
    expect(normalize('Café Año Ñú')).toBe('cafe ano nu');
  });
});
