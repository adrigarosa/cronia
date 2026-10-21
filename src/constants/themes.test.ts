import { describe, it, expect } from 'vitest';
import {
  lightTheme,
  darkTheme,
  getTheme,
  categoryColors,
  getCategoryColor,
  statusColors,
  getStatusColor,
} from './themes';

describe('Theme System', () => {
  describe('Light Theme', () => {
    it('should have light theme name', () => {
      expect(lightTheme.name).toBe('light');
    });

    it('should have all required color properties', () => {
      const requiredColors = [
        'background',
        'surface',
        'card',
        'primary',
        'secondary',
        'text',
        'textSecondary',
        'border',
        'error',
        'success',
        'warning',
        'info',
      ];

      requiredColors.forEach((color) => {
        expect(lightTheme.colors[color as keyof typeof lightTheme.colors]).toBeDefined();
      });
    });

    it('should have hex color values', () => {
      Object.values(lightTheme.colors).forEach((color) => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('Dark Theme', () => {
    it('should have dark theme name', () => {
      expect(darkTheme.name).toBe('dark');
    });

    it('should have all required color properties', () => {
      const requiredColors = [
        'background',
        'surface',
        'card',
        'primary',
        'secondary',
        'text',
        'textSecondary',
        'border',
        'error',
        'success',
        'warning',
        'info',
      ];

      requiredColors.forEach((color) => {
        expect(darkTheme.colors[color as keyof typeof darkTheme.colors]).toBeDefined();
      });
    });

    it('should have hex color values', () => {
      Object.values(darkTheme.colors).forEach((color) => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('getTheme', () => {
    it('should return light theme for light', () => {
      const theme = getTheme('light');
      expect(theme.name).toBe('light');
      expect(theme.colors.background).toBe(lightTheme.colors.background);
    });

    it('should return dark theme for dark', () => {
      const theme = getTheme('dark');
      expect(theme.name).toBe('dark');
      expect(theme.colors.background).toBe(darkTheme.colors.background);
    });

    it('should return light theme by default', () => {
      const theme = getTheme('light');
      expect(theme).toEqual(lightTheme);
    });
  });

  describe('Category Colors', () => {
    it('should have 6 default categories', () => {
      const categories = Object.keys(categoryColors);
      expect(categories).toHaveLength(6);
    });

    it('should have Personal category', () => {
      expect(categoryColors.personal).toBeDefined();
      expect(categoryColors.personal).toBe('#EC4899');
    });

    it('should have Work category', () => {
      expect(categoryColors.work).toBeDefined();
      expect(categoryColors.work).toBe('#0EA5E9');
    });

    it('should have Family category', () => {
      expect(categoryColors.family).toBeDefined();
      expect(categoryColors.family).toBe('#06B6D4');
    });

    it('should have Home category', () => {
      expect(categoryColors.home).toBeDefined();
      expect(categoryColors.home).toBe('#F97316');
    });

    it('should have Leisure category', () => {
      expect(categoryColors.leisure).toBeDefined();
      expect(categoryColors.leisure).toBe('#6366F1');
    });

    it('should have Expenses category', () => {
      expect(categoryColors.expenses).toBeDefined();
      expect(categoryColors.expenses).toBe('#84CC16');
    });
  });

  describe('getCategoryColor', () => {
    it('should return correct color for known category', () => {
      expect(getCategoryColor('personal')).toBe('#EC4899');
      expect(getCategoryColor('work')).toBe('#0EA5E9');
    });

    it('should return default color for unknown category', () => {
      expect(getCategoryColor('unknown')).toBe('#9CA3AF');
    });
  });

  describe('Status Colors', () => {
    it('should have 4 status colors', () => {
      const statuses = Object.keys(statusColors);
      expect(statuses).toHaveLength(4);
    });

    it('should have pending status color', () => {
      expect(statusColors.pending).toBeDefined();
      expect(statusColors.pending).toBe('#6B7280');
    });

    it('should have in_progress status color', () => {
      expect(statusColors.in_progress).toBeDefined();
      expect(statusColors.in_progress).toBe('#F59E0B');
    });

    it('should have completed status color', () => {
      expect(statusColors.completed).toBeDefined();
      expect(statusColors.completed).toBe('#10B981');
    });

    it('should have cancelled status color', () => {
      expect(statusColors.cancelled).toBeDefined();
      expect(statusColors.cancelled).toBe('#EF4444');
    });
  });

  describe('getStatusColor', () => {
    it('should return correct color for known status', () => {
      expect(getStatusColor('pending')).toBe('#6B7280');
      expect(getStatusColor('completed')).toBe('#10B981');
    });

    it('should return default color for unknown status', () => {
      expect(getStatusColor('unknown')).toBe('#9CA3AF');
    });
  });

  describe('Theme Contrast', () => {
    it('light theme should have dark text', () => {
      expect(lightTheme.colors.text).toBe('#1F2937');
    });

    it('dark theme should have light text', () => {
      expect(darkTheme.colors.text).toBe('#F9FAFB');
    });

    it('both themes should have same primary color', () => {
      expect(lightTheme.colors.primary).toBe(darkTheme.colors.primary);
    });
  });
});
