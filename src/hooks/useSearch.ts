/**
 * Hook personalizado para búsqueda y filtros
 */

import { useState, useCallback, useMemo } from 'react';
import { Task } from '../models';

export interface SearchFilters {
  query: string;
  status?: 'pending' | 'in_progress' | 'completed';
  categoryId?: string;
  startDate?: number;
  endDate?: number;
  type?: 'task' | 'note' | 'event' | 'habit';
}

interface UseSearchResult {
  query: string;
  filters: SearchFilters;
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  filteredTasks: Task[];
}

export function useSearch(tasks: Task[]): UseSearchResult {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
  });

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      query: newFilters.query ?? prev.query,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ query: '' });
  }, []);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filtrar por búsqueda de texto
    if (filters.query) {
      const lowerQuery = filters.query.toLowerCase();
      result = result.filter((task) =>
        task.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filtrar por estado
    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }

    // Filtrar por rango de fecha
    if (filters.startDate) {
      result = result.filter((task) => task.created_at >= filters.startDate!);
    }
    if (filters.endDate) {
      result = result.filter((task) => task.created_at <= filters.endDate!);
    }

    // Filtrar por categoría
    if (filters.categoryId) {
      result = result.filter((task) =>
        task.categories.includes(filters.categoryId!)
      );
    }

    return result;
  }, [tasks, filters]);

  return {
    query: filters.query,
    filters,
    setQuery: (q: string) => {
      updateFilters({ query: q });
    },
    setFilters: updateFilters,
    resetFilters,
    filteredTasks,
  };
}
