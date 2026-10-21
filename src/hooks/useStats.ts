/**
 * Hook personalizado para estadisticas
 */

import { useMemo } from 'react';
import { Task } from '../models';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
  avgCompletionDays: number;
}

interface UseStatsResult {
  taskStats: TaskStats;
  tasksByCategory: Record<string, number>;
  tasksByStatus: Record<string, number>;
}

export function useStats(tasks: Task[]): UseStatsResult {
  const taskStats = useMemo<TaskStats>(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const overdue = tasks.filter((t) => t.isOverdue()).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calcular promedio de días para completar
    const completedTasks = tasks.filter((t) => t.status === 'completed' && t.completed_at);
    const avgCompletionDays =
      completedTasks.length > 0
        ? Math.round(
            completedTasks.reduce((sum, task) => {
              const daysTaken = (task.completed_at! - task.created_at) / (1000 * 60 * 60 * 24);
              return sum + daysTaken;
            }, 0) / completedTasks.length
          )
        : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionRate,
      avgCompletionDays,
    };
  }, [tasks]);

  const tasksByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    tasks.forEach((task) => {
      task.categories.forEach((catId) => {
        categories[catId] = (categories[catId] || 0) + 1;
      });
    });
    return categories;
  }, [tasks]);

  const tasksByStatus = useMemo(() => {
    const statuses: Record<string, number> = {
      pending: 0,
      in_progress: 0,
      completed: 0,
    };

    tasks.forEach((task) => {
      if (task.status === 'pending') statuses.pending += 1;
      if (task.status === 'in_progress') statuses.in_progress += 1;
      if (task.status === 'completed') statuses.completed += 1;
    });

    return statuses;
  }, [tasks]);

  return {
    taskStats,
    tasksByCategory,
    tasksByStatus,
  };
}
