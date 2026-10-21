import { describe, it, expect } from 'vitest';
import { Task } from './Task';

describe('Task Model', () => {
  const now = Date.now();

  describe('Constructor', () => {
    it('creates a task with all properties', () => {
      const task = new Task('1', 'Buy groceries', now, now);
      expect(task.id).toBe('1');
      expect(task.description).toBe('Buy groceries');
      expect(task.status).toBe('pending');
      expect(task.categories).toEqual([]);
    });

    it('creates a task with categories', () => {
      const task = new Task('1', 'Work task', now, now, ['work', 'personal']);
      expect(task.categories).toEqual(['work', 'personal']);
    });
  });

  describe('markComplete', () => {
    it('marks task as completed', () => {
      const task = new Task('1', 'Task', now, now);
      task.markComplete();
      expect(task.status).toBe('completed');
      expect(task.completed_at).toBeDefined();
    });
  });

  describe('markInProgress', () => {
    it('marks task as in progress', () => {
      const task = new Task('1', 'Task', now, now);
      task.markInProgress();
      expect(task.status).toBe('in_progress');
    });
  });

  describe('isOverdue', () => {
    it('returns true for overdue tasks', () => {
      const pastDate = now - 86400000; // 1 day ago
      const task = new Task('1', 'Task', now, now, [], 'pending', pastDate);
      expect(task.isOverdue()).toBe(true);
    });

    it('returns false for future due dates', () => {
      const futureDate = now + 86400000; // 1 day from now
      const task = new Task('1', 'Task', now, now, [], 'pending', futureDate);
      expect(task.isOverdue()).toBe(false);
    });

    it('returns false for completed tasks', () => {
      const pastDate = now - 86400000;
      const task = new Task('1', 'Task', now, now, [], 'completed', pastDate, now);
      expect(task.isOverdue()).toBe(false);
    });

    it('returns false for tasks without due date', () => {
      const task = new Task('1', 'Task', now, now);
      expect(task.isOverdue()).toBe(false);
    });
  });

  describe('isPending', () => {
    it('returns true for pending tasks', () => {
      const task = new Task('1', 'Task', now, now);
      expect(task.isPending()).toBe(true);
    });

    it('returns false for completed tasks', () => {
      const task = new Task('1', 'Task', now, now, [], 'completed');
      expect(task.isPending()).toBe(false);
    });
  });

  describe('getTimeRemaining', () => {
    it('returns time remaining in ms', () => {
      const futureDate = now + 3600000; // 1 hour from now
      const task = new Task('1', 'Task', now, now, [], 'pending', futureDate);
      const remaining = task.getTimeRemaining();
      expect(remaining).toBeDefined();
      expect(remaining! > 0).toBe(true);
      expect(remaining! <= 3600000).toBe(true);
    });

    it('returns null for tasks without due date', () => {
      const task = new Task('1', 'Task', now, now);
      expect(task.getTimeRemaining()).toBeNull();
    });

    it('returns null for completed tasks', () => {
      const futureDate = now + 3600000;
      const task = new Task('1', 'Task', now, now, [], 'completed', futureDate, now);
      expect(task.getTimeRemaining()).toBeNull();
    });
  });
});
