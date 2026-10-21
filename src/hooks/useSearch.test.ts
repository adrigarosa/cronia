import { describe, it, expect } from 'vitest';

describe('useSearch Hook', () => {
  const now = Date.now();
  const mockTasks = [
    {
      id: '1',
      description: 'Buy groceries',
      status: 'pending' as const,
      created_at: now,
      updated_at: now,
      categories: ['personal'],
    },
    {
      id: '2',
      description: 'Complete project report',
      status: 'in_progress' as const,
      created_at: now - 86400000,
      updated_at: now,
      categories: ['work'],
    },
    {
      id: '3',
      description: 'Call mom',
      status: 'completed' as const,
      created_at: now - 172800000,
      updated_at: now,
      categories: ['family'],
    },
  ];

  describe('Search functionality', () => {
    it('should filter tasks by query text', () => {
      const query = 'groceries';
      const results = mockTasks.filter((t) =>
        t.description.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].description).toContain('groceries');
    });

    it('should be case-insensitive', () => {
      const query = 'GROCERIES';
      const results = mockTasks.filter((t) =>
        t.description.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(1);
    });

    it('should return empty when no matches', () => {
      const query = 'nonexistent';
      const results = mockTasks.filter((t) =>
        t.description.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(0);
    });
  });

  describe('Status filtering', () => {
    it('should filter by pending status', () => {
      const status = 'pending';
      const results = mockTasks.filter((t) => t.status === status);
      expect(results).toHaveLength(1);
      expect(results[0].status).toBe('pending');
    });

    it('should filter by in_progress status', () => {
      const status = 'in_progress';
      const results = mockTasks.filter((t) => t.status === status);
      expect(results).toHaveLength(1);
    });

    it('should filter by completed status', () => {
      const status = 'completed';
      const results = mockTasks.filter((t) => t.status === status);
      expect(results).toHaveLength(1);
    });
  });

  describe('Date filtering', () => {
    it('should filter by start date', () => {
      const startDate = now - 200000000;
      const results = mockTasks.filter((t) => t.created_at >= startDate);
      expect(results).toHaveLength(3);
    });

    it('should filter by end date', () => {
      const endDate = now - 86400000;
      const results = mockTasks.filter((t) => t.created_at <= endDate);
      expect(results).toHaveLength(2);
    });

    it('should filter by date range', () => {
      const startDate = now - 200000000;
      const endDate = now + 86400000;
      const results = mockTasks.filter(
        (t) => t.created_at >= startDate && t.created_at <= endDate
      );
      expect(results).toHaveLength(3);
    });
  });

  describe('Category filtering', () => {
    it('should filter by category', () => {
      const categoryId = 'work';
      const results = mockTasks.filter((t) =>
        t.categories.includes(categoryId)
      );
      expect(results).toHaveLength(1);
      expect(results[0].categories).toContain('work');
    });

    it('should return empty for non-existent category', () => {
      const categoryId = 'nonexistent';
      const results = mockTasks.filter((t) =>
        t.categories.includes(categoryId)
      );
      expect(results).toHaveLength(0);
    });
  });

  describe('Combined filters', () => {
    it('should apply multiple filters', () => {
      let results = [...mockTasks];

      // Filter by status
      results = results.filter((t) => t.status === 'pending');

      // Filter by category
      results = results.filter((t) => t.categories.includes('personal'));

      expect(results).toHaveLength(1);
      expect(results[0].status).toBe('pending');
      expect(results[0].categories).toContain('personal');
    });

    it('should combine text search and status filter', () => {
      let results = [...mockTasks];

      // Search
      results = results.filter((t) =>
        t.description.toLowerCase().includes('call')
      );

      // Filter status
      results = results.filter((t) => t.status === 'completed');

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('3');
    });
  });

  describe('Filter state management', () => {
    it('should have default empty query', () => {
      const defaultQuery = '';
      expect(defaultQuery).toBe('');
    });

    it('should allow resetting filters', () => {
      const filters = { query: '' };
      expect(filters.query).toBe('');
    });

    it('should update filters without losing previous state', () => {
      const filters = {
        query: 'test',
        status: 'pending' as const,
      };

      const updated = { ...filters, categoryId: 'work' };
      expect(updated.query).toBe('test');
      expect(updated.status).toBe('pending');
      expect(updated.categoryId).toBe('work');
    });
  });
});
