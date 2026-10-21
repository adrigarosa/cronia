import { describe, it, expect } from 'vitest';
import { Task, Note, Event, Habit, HabitLog, Category, TaskStatus, NoteClassification, EventStatus, HabitStatus } from './types';

describe('Database Types', () => {
  describe('Task Status', () => {
    it('allows valid task statuses', () => {
      const validStatuses: TaskStatus[] = ['pending', 'in_progress', 'completed', 'deleted'];
      expect(validStatuses).toHaveLength(4);
      expect(validStatuses).toContain('pending');
      expect(validStatuses).toContain('completed');
    });
  });

  describe('NoteClassification', () => {
    it('allows valid note classifications', () => {
      const validClassifications: NoteClassification[] = ['important', 'anecdote', 'reminder', 'reflection'];
      expect(validClassifications).toHaveLength(4);
      expect(validClassifications).toContain('important');
      expect(validClassifications).toContain('reminder');
    });
  });

  describe('EventStatus', () => {
    it('allows valid event statuses', () => {
      const validStatuses: EventStatus[] = ['upcoming', 'in_progress', 'completed', 'cancelled'];
      expect(validStatuses).toHaveLength(4);
      expect(validStatuses).toContain('upcoming');
      expect(validStatuses).toContain('cancelled');
    });
  });

  describe('HabitStatus', () => {
    it('allows valid habit statuses', () => {
      const validStatuses: HabitStatus[] = ['completed', 'pending', 'not_completed'];
      expect(validStatuses).toHaveLength(3);
      expect(validStatuses).toContain('completed');
      expect(validStatuses).toContain('not_completed');
    });
  });

  describe('Task Type', () => {
    it('creates a valid task object', () => {
      const task: Task = {
        id: '1',
        type: 'task',
        description: 'Test task',
        status: 'pending',
        created_at: Date.now(),
        updated_at: Date.now(),
        deleted: false,
      };

      expect(task.type).toBe('task');
      expect(task.description).toBeDefined();
      expect(task.status).toBe('pending');
    });

    it('allows optional due_date and completed_at', () => {
      const now = Date.now();
      const task: Task = {
        id: '1',
        type: 'task',
        description: 'Complete task',
        status: 'completed',
        due_date: now,
        completed_at: now,
        created_at: now,
        updated_at: now,
        deleted: false,
      };

      expect(task.due_date).toBeDefined();
      expect(task.completed_at).toBeDefined();
    });
  });

  describe('Note Type', () => {
    it('creates a valid note object', () => {
      const note: Note = {
        id: '1',
        type: 'note',
        content: 'Test note',
        classification: 'reminder',
        created_at: Date.now(),
        updated_at: Date.now(),
        deleted: false,
      };

      expect(note.type).toBe('note');
      expect(note.content).toBeDefined();
      expect(note.classification).toBe('reminder');
    });
  });

  describe('Event Type', () => {
    it('creates a valid event object', () => {
      const now = Date.now();
      const event: Event = {
        id: '1',
        type: 'event',
        description: 'Test event',
        start_date: now,
        start_time: '10:00',
        end_date: now,
        end_time: '11:00',
        status: 'upcoming',
        created_at: now,
        updated_at: now,
        deleted: false,
      };

      expect(event.type).toBe('event');
      expect(event.start_date).toBeDefined();
      expect(event.status).toBe('upcoming');
    });

    it('allows optional location', () => {
      const now = Date.now();
      const event: Event = {
        id: '1',
        type: 'event',
        description: 'Meeting',
        start_date: now,
        start_time: '14:00',
        end_date: now,
        end_time: '15:00',
        location: 'Office',
        status: 'upcoming',
        created_at: now,
        updated_at: now,
        deleted: false,
      };

      expect(event.location).toBe('Office');
    });
  });

  describe('Habit Type', () => {
    it('creates a valid habit object', () => {
      const now = Date.now();
      const habit: Habit = {
        id: '1',
        type: 'habit',
        name: 'Exercise',
        start_date: now,
        active: true,
        created_at: now,
        updated_at: now,
        deleted: false,
      };

      expect(habit.type).toBe('habit');
      expect(habit.name).toBeDefined();
      expect(habit.active).toBe(true);
    });
  });

  describe('HabitLog Type', () => {
    it('creates a valid habit log object', () => {
      const now = Date.now();
      const log: HabitLog = {
        id: '1',
        habit_id: 'habit-1',
        date: '2026-10-21',
        status: 'completed',
        created_at: now,
        updated_at: now,
      };

      expect(log.habit_id).toBeDefined();
      expect(log.date).toBeDefined();
      expect(log.status).toBe('completed');
    });

    it('allows optional note', () => {
      const now = Date.now();
      const log: HabitLog = {
        id: '1',
        habit_id: 'habit-1',
        date: '2026-10-21',
        status: 'completed',
        note: 'Completed at 6 AM',
        created_at: now,
        updated_at: now,
      };

      expect(log.note).toBeDefined();
    });
  });

  describe('Category Type', () => {
    it('creates a valid category object', () => {
      const category: Category = {
        id: 'work',
        name: 'Laboral',
        created_at: Date.now(),
      };

      expect(category.id).toBeDefined();
      expect(category.name).toBe('Laboral');
    });
  });
});
