import { describe, it, expect } from 'vitest';
import {
  exportTasksAsJSON,
  exportTasksAsCSV,
  parseExportedJSON,
  isValidExportFormat,
  getExportStats,
  generateFileName,
} from './dataExport';

describe('Data Export Utilities', () => {
  const mockTasks = [
    {
      id: '1',
      description: 'Task 1',
      status: 'pending' as const,
      created_at: Date.now(),
      updated_at: Date.now(),
      categories: [],
      isOverdue: () => false,
    },
    {
      id: '2',
      description: 'Task 2',
      status: 'completed' as const,
      created_at: Date.now(),
      updated_at: Date.now(),
      completed_at: Date.now(),
      categories: [],
      isOverdue: () => false,
    },
  ];

  describe('exportTasksAsJSON', () => {
    it('should export tasks as JSON string', () => {
      const json = exportTasksAsJSON(mockTasks);
      expect(typeof json).toBe('string');
      expect(json).toContain('version');
      expect(json).toContain('exportDate');
    });

    it('should include version in export', () => {
      const json = exportTasksAsJSON(mockTasks);
      expect(json).toContain('"version"');
    });

    it('should include export date in export', () => {
      const json = exportTasksAsJSON(mockTasks);
      expect(json).toContain('"exportDate"');
    });

    it('should include tasks array in export', () => {
      const json = exportTasksAsJSON(mockTasks);
      expect(json).toContain('"tasks"');
    });

    it('should include statistics in export', () => {
      const json = exportTasksAsJSON(mockTasks);
      expect(json).toContain('"stats"');
      expect(json).toContain('"total"');
      expect(json).toContain('"completed"');
      expect(json).toContain('"pending"');
    });
  });

  describe('exportTasksAsCSV', () => {
    it('should export tasks as CSV string', () => {
      const csv = exportTasksAsCSV(mockTasks);
      expect(typeof csv).toBe('string');
    });

    it('should include headers in CSV', () => {
      const csv = exportTasksAsCSV(mockTasks);
      expect(csv).toContain('ID');
      expect(csv).toContain('Descripcion');
      expect(csv).toContain('Estado');
    });

    it('should include task data in CSV', () => {
      const csv = exportTasksAsCSV(mockTasks);
      expect(csv).toContain('Task 1');
      expect(csv).toContain('pending');
    });

    it('should handle empty task list', () => {
      const csv = exportTasksAsCSV([]);
      expect(csv).toContain('ID,Descripcion,Estado');
    });
  });

  describe('parseExportedJSON', () => {
    it('should parse valid exported JSON', () => {
      const json = exportTasksAsJSON(mockTasks);
      const parsed = parseExportedJSON(json);
      expect(parsed).not.toBeNull();
      expect(parsed?.version).toBe('1.0.0');
    });

    it('should return null for invalid JSON', () => {
      const result = parseExportedJSON('invalid json');
      expect(result).toBeNull();
    });

    it('should validate required fields', () => {
      const invalidJson = JSON.stringify({ version: '1.0.0' });
      const result = parseExportedJSON(invalidJson);
      expect(result).toBeNull();
    });
  });

  describe('isValidExportFormat', () => {
    it('should validate correct export format', () => {
      const json = exportTasksAsJSON(mockTasks);
      expect(isValidExportFormat(json)).toBe(true);
    });

    it('should reject invalid JSON', () => {
      expect(isValidExportFormat('not json')).toBe(false);
    });

    it('should reject missing required fields', () => {
      const json = JSON.stringify({ version: '1.0.0' });
      const result = isValidExportFormat(json);
      expect(result).toBe(false);
    });

    it('should require tasks array', () => {
      const json = JSON.stringify({
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        stats: { total: 0, completed: 0, pending: 0 },
      });
      const result = isValidExportFormat(json);
      expect(result).toBe(false);
    });
  });

  describe('getExportStats', () => {
    it('should calculate total tasks', () => {
      const stats = getExportStats(mockTasks);
      expect(stats.total).toBe(2);
    });

    it('should count completed tasks', () => {
      const stats = getExportStats(mockTasks);
      expect(stats.completed).toBe(1);
    });

    it('should count pending tasks', () => {
      const stats = getExportStats(mockTasks);
      expect(stats.pending).toBe(1);
    });

    it('should calculate completion rate', () => {
      const stats = getExportStats(mockTasks);
      expect(stats.completionRate).toBe(50);
    });

    it('should return 0 completion rate for empty list', () => {
      const stats = getExportStats([]);
      expect(stats.completionRate).toBe(0);
    });
  });

  describe('generateFileName', () => {
    it('should generate JSON filename', () => {
      const fileName = generateFileName('json');
      expect(fileName).toContain('cronia-export');
      expect(fileName.endsWith('.json')).toBe(true);
    });

    it('should generate CSV filename', () => {
      const fileName = generateFileName('csv');
      expect(fileName).toContain('cronia-export');
      expect(fileName.endsWith('.csv')).toBe(true);
    });

    it('should include date in filename', () => {
      const fileName = generateFileName('json');
      const todayDate = new Date().toISOString().split('T')[0];
      expect(fileName).toContain(todayDate);
    });
  });
});
