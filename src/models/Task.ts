/**
 * Modelo de Tarea
 */

import { TaskStatus } from '../database/types';

export class Task {
  id: string;
  description: string;
  due_date?: number;
  status: TaskStatus;
  completed_at?: number;
  priority?: 'high' | 'medium' | 'low';
  created_at: number;
  updated_at: number;
  categories: string[]; // IDs de categorías

  constructor(
    id: string,
    description: string,
    created_at: number,
    updated_at: number,
    categories: string[] = [],
    status: TaskStatus = 'pending',
    due_date?: number,
    completed_at?: number
  ) {
    this.id = id;
    this.description = description;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.categories = categories;
    this.status = status;
    this.due_date = due_date;
    this.completed_at = completed_at;
  }

  /**
   * Marcar tarea como completada
   */
  markComplete(): void {
    this.status = 'completed';
    this.completed_at = Date.now();
    this.updated_at = Date.now();
  }

  /**
   * Marcar tarea como en progreso
   */
  markInProgress(): void {
    this.status = 'in_progress';
    this.updated_at = Date.now();
  }

  /**
   * Verificar si la tarea está vencida
   */
  isOverdue(): boolean {
    if (!this.due_date) return false;
    if (this.status === 'completed') return false;
    return this.due_date < Date.now();
  }

  /**
   * Verificar si la tarea está pendiente
   */
  isPending(): boolean {
    return this.status === 'pending';
  }

  /**
   * Obtener tiempo restante en milisegundos
   */
  getTimeRemaining(): number | null {
    if (!this.due_date) return null;
    if (this.status === 'completed') return null;
    return this.due_date - Date.now();
  }
}
