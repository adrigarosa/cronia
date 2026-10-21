/**
 * Sistema de temas para CRONIA
 * Define paletas de colores para tema claro y oscuro
 */

export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface Theme {
  name: ThemeType;
  colors: ThemeColors;
}

/**
 * Tema claro (por defecto)
 */
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#F3F4F6',
    primary: '#EC4899',
    secondary: '#06B6D4',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
};

/**
 * Tema oscuro
 */
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#111827',
    surface: '#1F2937',
    card: '#374151',
    primary: '#EC4899',
    secondary: '#06B6D4',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#4B5563',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    info: '#60A5FA',
  },
};

/**
 * Obtener tema por nombre
 */
export function getTheme(themeName: ThemeType): Theme {
  return themeName === 'dark' ? darkTheme : lightTheme;
}

/**
 * Colores de categorías
 */
export const categoryColors: Record<string, string> = {
  personal: '#EC4899', // Pink
  work: '#0EA5E9',     // Sky Blue
  family: '#06B6D4',   // Cyan
  home: '#F97316',     // Orange
  leisure: '#6366F1',  // Indigo
  expenses: '#84CC16', // Lime
};

/**
 * Obtener color de categoría por ID
 */
export function getCategoryColor(categoryId: string): string {
  return categoryColors[categoryId] || '#9CA3AF';
}

/**
 * Colores para estados
 */
export const statusColors = {
  pending: '#6B7280',      // Gray
  in_progress: '#F59E0B',  // Amber
  completed: '#10B981',    // Emerald
  cancelled: '#EF4444',    // Red
};

/**
 * Obtener color de estado
 */
export function getStatusColor(status: string): string {
  return statusColors[status as keyof typeof statusColors] || '#9CA3AF';
}
