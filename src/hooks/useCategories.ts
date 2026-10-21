/**
 * Hook personalizado para obtener categorias
 */

import { useState, useCallback, useEffect } from 'react';
import { Category } from '../models';
import { getCategories as getCategoriesFromDb } from '../database';

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refreshCategories();
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dbCategories = await getCategoriesFromDb();
      const categoryModels = dbCategories.map(
        (cat) => new Category(cat.id, cat.name, cat.created_at, true)
      );
      setCategories(categoryModels);
    } catch (err) {
      setError((err as Error).message);
      console.error('Error cargando categorias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoryById = useCallback(
    (id: string) => {
      return categories.find((cat) => cat.id === id);
    },
    [categories]
  );

  return {
    categories,
    loading,
    error,
    refreshCategories,
    getCategoryById,
  };
}
