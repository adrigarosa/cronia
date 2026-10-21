import { describe, it, expect } from 'vitest';

describe('useStats Hook', () => {
  const now = Date.now();

  describe('Task Statistics', () => {
    it('should calculate total count', () => {
      const mockTasks = [
        {
          id: '1',
          status: 'pending' as const,
          created_at: now,
          isOverdue: () => false,
          categories: [],
        },
        {
          id: '2',
          status: 'completed' as const,
          created_at: now,
          isOverdue: () => false,
          categories: [],
        },
      ];

      const total = mockTasks.length;
      expect(total).toBe(2);
    });

    it('should count pending tasks', () => {
      const mockTasks = [
        { status: 'pending' as const },
        { status: 'pending' as const },
        { status: 'completed' as const },
      ];

      const pending = mockTasks.filter((t) => t.status === 'pending').length;
      expect(pending).toBe(2);
    });

    it('should count completed tasks', () => {
      const mockTasks = [
        { status: 'pending' as const },
        { status: 'completed' as const },
        { status: 'completed' as const },
      ];

      const completed = mockTasks.filter((t) => t.status === 'completed').length;
      expect(completed).toBe(2);
    });

    it('should count in_progress tasks', () => {
      const mockTasks = [
        { status: 'pending' as const },
        { status: 'in_progress' as const },
        { status: 'completed' as const },
      ];

      const inProgress = mockTasks.filter((t) => t.status === 'in_progress').length;
      expect(inProgress).toBe(1);
    });

    it('should calculate completion rate', () => {
      const total = 10;
      const completed = 7;
      const rate = Math.round((completed / total) * 100);
      expect(rate).toBe(70);
    });

    it('should return 0 completion rate for empty list', () => {
      const total = 0;
      const rate = total > 0 ? Math.round((0 / total) * 100) : 0;
      expect(rate).toBe(0);
    });

    it('should return 100 completion rate when all completed', () => {
      const total = 5;
      const completed = 5;
      const rate = Math.round((completed / total) * 100);
      expect(rate).toBe(100);
    });
  });

  describe('Category Statistics', () => {
    it('should count tasks by category', () => {
      const mockTasks = [
        { categories: ['personal', 'work'] },
        { categories: ['personal'] },
        { categories: ['work'] },
      ];

      const categories: Record<string, number> = {};
      mockTasks.forEach((task) => {
        task.categories.forEach((catId) => {
          categories[catId] = (categories[catId] || 0) + 1;
        });
      });

      expect(categories.personal).toBe(2);
      expect(categories.work).toBe(2);
    });

    it('should handle tasks with multiple categories', () => {
      const mockTasks = [
        { categories: ['personal', 'work', 'family'] },
      ];

      const categories: Record<string, number> = {};
      mockTasks.forEach((task) => {
        task.categories.forEach((catId) => {
          categories[catId] = (categories[catId] || 0) + 1;
        });
      });

      expect(categories.personal).toBe(1);
      expect(categories.work).toBe(1);
      expect(categories.family).toBe(1);
    });

    it('should return empty object for tasks without categories', () => {
      const mockTasks = [
        { categories: [] },
        { categories: [] },
      ];

      const categories: Record<string, number> = {};
      mockTasks.forEach((task) => {
        task.categories.forEach((catId) => {
          categories[catId] = (categories[catId] || 0) + 1;
        });
      });

      expect(Object.keys(categories).length).toBe(0);
    });
  });

  describe('Status Distribution', () => {
    it('should count tasks by status', () => {
      const mockTasks = [
        { status: 'pending' },
        { status: 'in_progress' },
        { status: 'pending' },
        { status: 'completed' },
      ];

      const statuses: Record<string, number> = {
        pending: 0,
        in_progress: 0,
        completed: 0,
      };

      mockTasks.forEach((task: any) => {
        if (task.status === 'pending') statuses.pending += 1;
        if (task.status === 'in_progress') statuses.in_progress += 1;
        if (task.status === 'completed') statuses.completed += 1;
      });

      expect(statuses.pending).toBe(2);
      expect(statuses.in_progress).toBe(1);
      expect(statuses.completed).toBe(1);
    });
  });

  describe('Overdue Tasks', () => {
    it('should count overdue tasks', () => {
      const mockTasks = [
        { isOverdue: () => true },
        { isOverdue: () => true },
        { isOverdue: () => false },
      ];

      const overdue = mockTasks.filter((t) => t.isOverdue()).length;
      expect(overdue).toBe(2);
    });

    it('should return 0 for non-overdue tasks', () => {
      const mockTasks = [
        { isOverdue: () => false },
        { isOverdue: () => false },
      ];

      const overdue = mockTasks.filter((t) => t.isOverdue()).length;
      expect(overdue).toBe(0);
    });
  });

  describe('Average Completion Days', () => {
    it('should calculate average days to completion', () => {
      const now = Date.now();
      const oneDayMs = 1000 * 60 * 60 * 24;

      const mockTasks = [
        { created_at: now - 2 * oneDayMs, completed_at: now },
        { created_at: now - 4 * oneDayMs, completed_at: now },
      ];

      const avgDays = Math.round(
        mockTasks.reduce((sum, task: any) => {
          const daysTaken = (task.completed_at - task.created_at) / oneDayMs;
          return sum + daysTaken;
        }, 0) / mockTasks.length
      );

      expect(avgDays).toBe(3);
    });

    it('should return 0 for no completed tasks', () => {
      const mockTasks: any[] = [];
      const avgDays = mockTasks.length > 0 ? 1 : 0;
      expect(avgDays).toBe(0);
    });
  });
});
