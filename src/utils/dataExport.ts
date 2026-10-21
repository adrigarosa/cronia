/**
 * Utilidades para exportar e importar datos
 */

import { Task } from '../models';

export interface ExportedData {
  version: string;
  exportDate: string;
  tasks: Task[];
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

/**
 * Exportar tareas en formato JSON
 */
export function exportTasksAsJSON(tasks: Task[]): string {
  const exportedData: ExportedData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    tasks,
    stats: {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      pending: tasks.filter((t) => t.status === 'pending').length,
    },
  };

  return JSON.stringify(exportedData, null, 2);
}

/**
 * Exportar tareas en formato CSV
 */
export function exportTasksAsCSV(tasks: Task[]): string {
  const headers = ['ID', 'Descripcion', 'Estado', 'Vencimiento', 'Completado', 'Creado'];
  const rows = tasks.map((task) => [
    task.id,
    `"${task.description.replace(/"/g, '""')}"`,
    task.status,
    task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    task.completed_at ? new Date(task.completed_at).toISOString().split('T')[0] : '',
    new Date(task.created_at).toISOString().split('T')[0],
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

  return csvContent;
}

/**
 * Parsear datos exportados en JSON
 */
export function parseExportedJSON(jsonString: string): ExportedData | null {
  try {
    const parsed = JSON.parse(jsonString) as ExportedData;

    // Validar estructura
    if (!parsed.version || !parsed.exportDate || !Array.isArray(parsed.tasks)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

/**
 * Validar formato de exportacion
 */
export function isValidExportFormat(data: string): boolean {
  try {
    const parsed = JSON.parse(data);
    const isValid =
      !!parsed.version &&
      !!parsed.exportDate &&
      Array.isArray(parsed.tasks) &&
      !!parsed.stats &&
      typeof parsed.stats.total === 'number';
    return isValid;
  } catch (error) {
    return false;
  }
}

/**
 * Obtener estadísticas de exportación
 */
export function getExportStats(tasks: Task[]) {
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    overdue: tasks.filter((t) => t.isOverdue()).length,
    completionRate: tasks.length > 0 
      ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100)
      : 0,
  };
}

/**
 * Generar nombre de archivo para descarga
 */
export function generateFileName(format: 'json' | 'csv'): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const extension = format === 'json' ? '.json' : '.csv';
  return `cronia-export-${timestamp}${extension}`;
}
