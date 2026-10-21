import { describe, it, expect } from 'vitest';
import { buildTimeline } from './timeline';

const base = { type: 'x', deleted: false } as any;

describe('buildTimeline', () => {
  it('merges all kinds sorted by created_at desc', () => {
    const items = buildTimeline(
      [{ ...base, id: 't', description: 'Tarea', status: 'pending', created_at: 1, updated_at: 1 }],
      [{ ...base, id: 'n', content: 'Nota', classification: 'important', created_at: 3, updated_at: 3 }],
      [
        {
          ...base,
          id: 'e',
          description: 'Evento',
          start_date: 0,
          start_time: '10:00',
          end_date: 0,
          end_time: '11:00',
          status: 'upcoming',
          created_at: 2,
          updated_at: 2,
        },
      ],
      [{ ...base, id: 'h', name: 'Habito', active: true, start_date: 0, created_at: 4, updated_at: 4 }]
    );
    expect(items.map((i) => i.id)).toEqual(['h', 'n', 'e', 't']);
    expect(items.map((i) => i.kind)).toEqual(['habit', 'note', 'event', 'task']);
  });

  it('marks completed tasks as done and labels note classification', () => {
    const items = buildTimeline(
      [{ ...base, id: 't', description: 'x', status: 'completed', created_at: 1, updated_at: 1 }],
      [{ ...base, id: 'n', content: 'y', classification: 'reminder', created_at: 2, updated_at: 2 }],
      [],
      []
    );
    expect(items.find((i) => i.id === 't')?.done).toBe(true);
    expect(items.find((i) => i.id === 'n')?.subtitle).toBe('Recordatorio');
  });

  it('returns empty list for no data', () => {
    expect(buildTimeline([], [], [], [])).toEqual([]);
  });
});
