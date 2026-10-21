import { withUpdates } from '../utils/clone';
/**
 * Hook personalizado para operaciones CRUD de tareas
 */

import { useState, useCallback, useEffect } from 'react';
import { Task } from '../models';
import {
  createTask,
  getTasks,
  updateTask,
  completeTask,
  deleteTask,
  getOverdueTasks,
  getTasksByStatus,
} from '../database';
import { generateId } from '../utils/id';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createNewTask: (description: string, dueDate?: number, categoryId?: string) => Promise<void>;
  completeExistingTask: (id: string) => Promise<void>;
  deleteExistingTask: (id: string) => Promise<void>;
  updateExistingTask: (id: string, updates: Partial<Task>) => Promise<void>;
  refreshTasks: () => Promise<void>;
  getOverdue: () => Promise<Task[]>;
  getByStatus: (status: 'pending' | 'in_progress' | 'completed') => Promise<Task[]>;
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dbTasks = await getTasks();
      const taskModels = dbTasks.map(
        (task) =>
          new Task(
            task.id,
            task.description,
            task.created_at,
            task.updated_at,
            [],
            task.status,
            task.due_date,
            task.completed_at
          )
      );
      setTasks(taskModels);
    } catch (err) {
      setError((err as Error).message);
      console.error('Error cargando tareas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewTask = useCallback(
    async (description: string, dueDate?: number, categoryId?: string) => {
      try {
        setError(null);
        const id = generateId();
        const now = Date.now();
        const newTask = new Task(id, description, now, now, categoryId ? [categoryId] : []);
        if (dueDate) {
          newTask.due_date = dueDate;
        }
        await createTask(id, description, dueDate);
        setTasks((prev) => [newTask, ...prev]);
      } catch (err) {
        setError((err as Error).message);
        console.error('Error creando tarea:', err);
        throw err;
      }
    },
    []
  );

  const completeExistingTask = useCallback(async (id: string) => {
    try {
      setError(null);
      const now = Date.now();
      await completeTask(id);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? withUpdates(task, { status: 'completed' as const, completed_at: now }) : task
        )
      );
    } catch (err) {
      setError((err as Error).message);
      console.error('Error completando tarea:', err);
      throw err;
    }
  }, []);

  const deleteExistingTask = useCallback(async (id: string) => {
    try {
      setError(null);
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError((err as Error).message);
      console.error('Error eliminando tarea:', err);
      throw err;
    }
  }, []);

  const updateExistingTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      setError(null);
      await updateTask(id, updates);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? withUpdates(task, { ...updates, updated_at: Date.now() }) : task
        )
      );
    } catch (err) {
      setError((err as Error).message);
      console.error('Error actualizando tarea:', err);
      throw err;
    }
  }, []);

  const getOverdue = useCallback(async () => {
    try {
      setError(null);
      const overdueTasks = await getOverdueTasks();
      return overdueTasks.map(
        (task) =>
          new Task(
            task.id,
            task.description,
            task.created_at,
            task.updated_at,
            [],
            task.status,
            task.due_date,
            task.completed_at
          )
      );
    } catch (err) {
      setError((err as Error).message);
      console.error('Error obteniendo tareas vencidas:', err);
      return [];
    }
  }, []);

  const getByStatus = useCallback(
    async (status: 'pending' | 'in_progress' | 'completed') => {
      try {
        setError(null);
        const statusTasks = await getTasksByStatus(status);
        return statusTasks.map(
          (task) =>
            new Task(
              task.id,
              task.description,
              task.created_at,
              task.updated_at,
              [],
              task.status,
              task.due_date,
              task.completed_at
            )
        );
      } catch (err) {
        setError((err as Error).message);
        console.error('Error obteniendo tareas por estado:', err);
        return [];
      }
    },
    []
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshTasks();
  }, [refreshTasks]);

  return {
    tasks,
    loading,
    error,
    createNewTask,
    completeExistingTask,
    deleteExistingTask,
    updateExistingTask,
    refreshTasks,
    getOverdue,
    getByStatus,
  };
}
