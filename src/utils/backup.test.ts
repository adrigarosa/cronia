import { describe, it, expect } from 'vitest';
import { buildBackupJson, parseBackupJson, BackupSource } from './backup';
import type { Task } from '../database/types';

const NOW = new Date(2026, 9, 22, 12).getTime();

const TASK: Task = {
  id: 't1',
  type: 'task',
  description: 'Comprar pan',
  due_date: new Date(2026, 9, 23).getTime(),
  status: 'pending',
  completed_at: undefined,
  created_at: NOW,
  updated_at: NOW,
  deleted: false,
};

function src(over: Partial<BackupSource> = {}): BackupSource {
  return {
    tasks: [TASK],
    notes: [],
    events: [],
    habits: [],
    logs: [],
    categories: [{ id: 'home', name: 'Hogar', created_at: NOW, archived: 0 }],
    categoryMap: { t1: ['home'] },
    ...over,
  };
}

describe('buildBackupJson / parseBackupJson', () => {
  it('roundtrip conserva todos los datos', () => {
    const json = buildBackupJson(src(), NOW);
    const parsed = parseBackupJson(json);

    expect(parsed.version).toBe('1');
    expect(parsed.exportDate).toBe(new Date(NOW).toISOString());
    expect(parsed.tasks).toEqual([TASK]);
    expect(parsed.categories).toEqual([{ id: 'home', name: 'Hogar', created_at: NOW, archived: 0 }]);
    expect(parsed.categoryMap).toEqual({ t1: ['home'] });
  });

  it('roundtrip con hábitos y logs', () => {
    const source = src({
      habits: [
        {
          id: 'h1',
          type: 'habit',
          name: 'Leer',
          start_date: NOW,
          active: true,
          days: '1111100',
          created_at: NOW,
          updated_at: NOW,
          deleted: false,
        },
      ],
      logs: [
        {
          id: 'l1',
          habit_id: 'h1',
          date: '2026-10-22',
          status: 'completed',
          created_at: NOW,
          updated_at: NOW,
        },
      ],
    });
    const parsed = parseBackupJson(buildBackupJson(source, NOW));
    expect(parsed.habits[0].days).toBe('1111100');
    expect(parsed.habitLogs[0].status).toBe('completed');
  });

  it('rechaza JSON inválido', () => {
    expect(() => parseBackupJson('no es json')).toThrow('JSON válido');
  });

  it('rechaza objetos que no son una copia de CRONIA', () => {
    expect(() => parseBackupJson('{"otra":"cosa"}')).toThrow('copia de CRONIA');
    expect(() => parseBackupJson('[1,2,3]')).toThrow('copia de CRONIA');
    expect(() => parseBackupJson('null')).toThrow('copia de CRONIA');
  });

  it('sanea listas ausentes y entradas sin id', () => {
    const parsed = parseBackupJson(
      JSON.stringify({ version: '1', tasks: [{ id: 't1' }, { sin: 'id' }], notes: 'no-array' })
    );
    expect(parsed.tasks).toHaveLength(1);
    expect(parsed.notes).toEqual([]);
    expect(parsed.events).toEqual([]);
    expect(parsed.categoryMap).toEqual({});
  });

  it('sanea categoryMap con valores no listados', () => {
    const parsed = parseBackupJson(
      JSON.stringify({
        version: '1',
        categoryMap: { t1: ['home', 42], t2: 'no-array' },
      })
    );
    expect(parsed.categoryMap).toEqual({ t1: ['home'] });
  });
});
