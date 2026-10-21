/**
 * Utilidades de analisis y estadisticas para CRONIA
 */

import { Task } from '../models';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
  averageTimeToComplete: number;
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  taskCount: number;
  completedCount: number;
  completionRate: number;
}

export interface TimeStats {
  todayTasks: number;
  thisWeekTasks: number;
  thisMonthTasks: number;
  pastDue: number;
}

export interface TrendData {
  date: string;
  tasksCreated: number;
  tasksCompleted: number;
  completionRate: number;
}

/**
 * Calcular estadisticas de tareas
 */
export function calculateTaskStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const overdue = tasks.filter((t) => t.isOverdue()).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const completedTasks = tasks.filter((t) => t.status === 'completed' && t.completed_at);
  const timeToComplete =
    completedTasks.length > 0
      ? completedTasks.reduce((sum, t) => sum + (t.completed_at! - t.created_at), 0) /
        completedTasks.length /
        (1000 * 60 * 60 * 24)
      : 0;

  return {
    total,
    completed,
    pending,
    inProgress,
    overdue,
    completionRate,
    averageTimeToComplete: Math.round(timeToComplete),
  };
}

/**
 * Calcular estadisticas por categoria
 */
export function calculateCategoryStats(
  tasks: Task[],
  categories: Array<{ id: string; name: string }>
): CategoryStats[] {
  return categories.map((category) => {
    const categoryTasks = tasks.filter((t) =>
      t.categories.some((c) => c.id === category.id)
    );
    const completed = categoryTasks.filter((t) => t.status === 'completed').length;
    const total = categoryTasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      categoryId: category.id,
      categoryName: category.name,
      taskCount: total,
      completedCount: completed,
      completionRate,
    };
  });
}

/**
 * Calcular estadisticas por tiempo
 */
export function calculateTimeStats(tasks: Task[]): TimeStats {
  const now = Date.now();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  return {
    todayTasks: tasks.filter((t) => t.created_at >= todayStart.getTime()).length,
    thisWeekTasks: tasks.filter((t) => t.created_at >= weekStart.getTime()).length,
    thisMonthTasks: tasks.filter((t) => t.created_at >= monthStart.getTime()).length,
    pastDue: tasks.filter((t) => t.isOverdue()).length,
  };
}

/**
 * Obtener datos de tendencia diaria
 */
export function getTrendData(tasks: Task[], daysBack: number = 30): TrendData[] {
  const trends: Record<string, { created: number; completed: number; total: number }> = {};

  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    trends[dateStr] = { created: 0, completed: 0, total: 0 };
  }

  tasks.forEach((task) => {
    const createdDate = new Date(task.created_at).toISOString().split('T')[0];
    if (trends[createdDate]) {
      trends[createdDate].created++;
      trends[createdDate].total++;
    }

    if (task.completed_at) {
      const completedDate = new Date(task.completed_at).toISOString().split('T')[0];
      if (trends[completedDate]) {
        trends[completedDate].completed++;
      }
    }
  });

  return Object.entries(trends).map(([date, data]) => ({
    date,
    tasksCreated: data.created,
    tasksCompleted: data.completed,
    completionRate:
      data.total > 0
        ? Math.round((data.completed / data.total) * 100)
        : 0,
  }));
}

/**
 * Obtener tareas de alto impacto (vencidas y con prioridad)
 */
export function getHighImpactTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.isOverdue() && t.status !== 'completed').sort((a, b) => {
    const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const priorityDiff = (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
    if (priorityDiff !== 0) return priorityDiff;
    return a.due_date ? new Date(a.due_date).getTime() - new Date(b.due_date).getTime() : 0;
  });
}

/**
 * Calcular productividad en rango de fechas
 */
export function getProductivityInRange(tasks: Task[], startDate: Date, endDate: Date): number {
  const tasksInRange = tasks.filter((t) => {
    const createdDate = new Date(t.created_at);
    return createdDate >= startDate && createdDate <= endDate;
  });

  if (tasksInRange.length === 0) return 0;

  const completed = tasksInRange.filter((t) => t.status === 'completed').length;
  return Math.round((completed / tasksInRange.length) * 100);
}
