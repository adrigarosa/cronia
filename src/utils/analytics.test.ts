import { describe, it, expect } from 'vitest';
import {
  calculateTaskStats,
  calculateCategoryStats,
  calculateTimeStats,
  getTrendData,
  getHighImpactTasks,
  getProductivityInRange,
} from './analytics';

const mockTasks = [
  {
    id: '1',
    description: 'Task 1',
    status: 'completed' as const,
    created_at: Date.now() - 10 * 24 * 60 * 60 * 1000,
    completed_at: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updated_at: Date.now(),
    due_date: Date.now() + 5 * 24 * 60 * 60 * 1000,
    priority: 'high' as const,
    categories: [],
    isOverdue: () => false,
  },
  {
    id: '2',
    description: 'Task 2',
    status: 'pending' as const,
    created_at: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updated_at: Date.now(),
    due_date: Date.now() - 1 * 24 * 60 * 60 * 1000,
    priority: 'medium' as const,
    categories: [],
    isOverdue: () => true,
  },
  {
    id: '3',
    description: 'Task 3',
    status: 'in_progress' as const,
    created_at: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updated_at: Date.now(),
    priority: 'low' as const,
    categories: [],
    isOverdue: () => false,
  },
];

describe('Analytics Utilities', () => {
  describe('Calculate Task Stats', () => {
    it('should calculate total tasks', () => {
      const stats = calculateTaskStats(mockTasks);
      expect(stats.total).toBe(3);
    });

    it('should count completed tasks', () => {
      const stats = calculateTaskStats(mockTasks);
      expect(stats.completed).toBe(1);
    });

    it('should count pending tasks', () => {
      const stats = calculateTaskStats(mockTasks);
      expect(stats.pending).toBe(1);
    });

    it('should count in_progress tasks', () => {
      const stats = calculateTaskStats(mockTasks);
      expect(stats.inProgress).toBe(1);
    });

    it('should count overdue tasks', () => {
      const stats = calculateTaskStats(mockTasks);
      expect(stats.overdue).toBe(1);
    });

    it('should calculate completion rate', () => {
      const stats = calculateTaskStats(mockTasks);
      expect(stats.completionRate).toBeGreaterThan(0);
      expect(stats.completionRate).toBeLessThanOrEqual(100);
    });

    it('should return 0 completion rate for empty list', () => {
      const stats = calculateTaskStats([]);
      expect(stats.completionRate).toBe(0);
    });

    it('should calculate average time to complete', () => {
      const stats = calculateTaskStats(mockTasks);
      expect(stats.averageTimeToComplete).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Calculate Category Stats', () => {
    it('should calculate stats for categories', () => {
      const categories = [
        { id: 'cat1', name: 'Personal' },
        { id: 'cat2', name: 'Work' },
      ];
      const tasksWithCategories = [
        {
          ...mockTasks[0],
          categories: [{ id: 'cat1', name: 'Personal' }],
        },
      ];

      const stats = calculateCategoryStats(tasksWithCategories, categories);
      expect(stats).toHaveLength(2);
    });

    it('should calculate completion rate per category', () => {
      const categories = [{ id: 'cat1', name: 'Personal' }];
      const tasksWithCategories = [
        {
          ...mockTasks[0],
          categories: [{ id: 'cat1', name: 'Personal' }],
        },
      ];

      const stats = calculateCategoryStats(tasksWithCategories, categories);
      expect(stats[0].completionRate).toBeDefined();
    });
  });

  describe('Calculate Time Stats', () => {
    it('should get today tasks count', () => {
      const stats = calculateTimeStats(mockTasks);
      expect(stats.todayTasks).toBeGreaterThanOrEqual(0);
    });

    it('should get this week tasks count', () => {
      const stats = calculateTimeStats(mockTasks);
      expect(stats.thisWeekTasks).toBeGreaterThanOrEqual(0);
    });

    it('should get this month tasks count', () => {
      const stats = calculateTimeStats(mockTasks);
      expect(stats.thisMonthTasks).toBeGreaterThanOrEqual(0);
    });

    it('should count past due tasks', () => {
      const stats = calculateTimeStats(mockTasks);
      expect(stats.pastDue).toBe(1);
    });

    it('should have consistent time stats', () => {
      const stats = calculateTimeStats(mockTasks);
      expect(stats.todayTasks).toBeLessThanOrEqual(stats.thisWeekTasks);
      expect(stats.thisWeekTasks).toBeLessThanOrEqual(stats.thisMonthTasks);
    });
  });

  describe('Get Trend Data', () => {
    it('should return trend data for 30 days', () => {
      const trends = getTrendData(mockTasks, 30);
      expect(trends.length).toBe(30);
    });

    it('should have date strings in trend data', () => {
      const trends = getTrendData(mockTasks, 30);
      trends.forEach((trend) => {
        const dateRegex = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
        expect(dateRegex.test(trend.date)).toBe(true);
      });
    });

    it('should calculate completion rate per day', () => {
      const trends = getTrendData(mockTasks, 30);
      trends.forEach((trend) => {
        expect(trend.completionRate).toBeGreaterThanOrEqual(0);
        expect(trend.completionRate).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Get High Impact Tasks', () => {
    it('should return overdue tasks', () => {
      const highImpact = getHighImpactTasks(mockTasks);
      expect(highImpact.length).toBeGreaterThan(0);
      expect(highImpact.some((t) => t.isOverdue())).toBe(true);
    });

    it('should exclude completed tasks', () => {
      const highImpact = getHighImpactTasks(mockTasks);
      expect(highImpact.every((t) => t.status !== 'completed')).toBe(true);
    });

    it('should sort by priority', () => {
      const highImpact = getHighImpactTasks(mockTasks);
      if (highImpact.length > 1) {
        for (let i = 0; i < highImpact.length - 1; i++) {
          const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
          expect(
            (priorityMap[highImpact[i].priority] || 0) >=
              (priorityMap[highImpact[i + 1].priority] || 0)
          ).toBe(true);
        }
      }
    });
  });

  describe('Get Productivity in Range', () => {
    it('should calculate productivity for date range', () => {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = new Date();
      const productivity = getProductivityInRange(mockTasks, startDate, endDate);
      expect(productivity).toBeGreaterThanOrEqual(0);
      expect(productivity).toBeLessThanOrEqual(100);
    });

    it('should return 0 for empty range', () => {
      const startDate = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const productivity = getProductivityInRange([], startDate, endDate);
      expect(productivity).toBe(0);
    });
  });
});
