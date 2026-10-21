/**
 * Sistema de notificaciones locales para CRONIA
 */

export type NotificationType = 'task_reminder' | 'habit_reminder' | 'milestone' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  data?: Record<string, any>;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  taskReminders: boolean;
  habitReminders: boolean;
}

/**
 * Crear notificacion de recordatorio de tarea
 */
export function createTaskReminderNotification(taskId: string, taskTitle: string): Notification {
  return {
    id: `task_${taskId}_${Date.now()}`,
    type: 'task_reminder',
    title: 'Recordatorio de Tarea',
    body: `No olvides: ${taskTitle}`,
    timestamp: Date.now(),
    read: false,
    data: { taskId },
  };
}

/**
 * Crear notificacion de recordatorio de habito
 */
export function createHabitReminderNotification(habitId: string, habitTitle: string): Notification {
  return {
    id: `habit_${habitId}_${Date.now()}`,
    type: 'habit_reminder',
    title: 'Recordatorio de Habito',
    body: `Ya completaste: ${habitTitle}?`,
    timestamp: Date.now(),
    read: false,
    data: { habitId },
  };
}

/**
 * Crear notificacion de hito
 */
export function createMilestoneNotification(milestone: string, details: string): Notification {
  return {
    id: `milestone_${Date.now()}`,
    type: 'milestone',
    title: 'Felicidades',
    body: `${milestone}: ${details}`,
    timestamp: Date.now(),
    read: false,
  };
}

/**
 * Crear notificacion informativa
 */
export function createInfoNotification(title: string, body: string): Notification {
  return {
    id: `info_${Date.now()}`,
    type: 'info',
    title,
    body,
    timestamp: Date.now(),
    read: false,
  };
}

/**
 * Validar notificacion
 */
export function isValidNotification(notification: any): boolean {
  if (!notification) return false;
  return (
    typeof notification.id === 'string' &&
    ['task_reminder', 'habit_reminder', 'milestone', 'info'].includes(notification.type) &&
    typeof notification.title === 'string' &&
    typeof notification.body === 'string' &&
    typeof notification.timestamp === 'number' &&
    typeof notification.read === 'boolean'
  );
}

/**
 * Agrupar notificaciones por tipo
 */
export function groupNotificationsByType(notifications: Notification[]): Record<NotificationType, Notification[]> {
  return notifications.reduce((acc, notification) => {
    if (!acc[notification.type]) {
      acc[notification.type] = [];
    }
    acc[notification.type].push(notification);
    return acc;
  }, {} as Record<NotificationType, Notification[]>);
}

/**
 * Obtener notificaciones no leidas
 */
export function getUnreadNotifications(notifications: Notification[]): Notification[] {
  return notifications.filter((n) => !n.read);
}

/**
 * Contar notificaciones no leidas
 */
export function countUnreadNotifications(notifications: Notification[]): number {
  return getUnreadNotifications(notifications).length;
}

/**
 * Marcar notificacion como leida
 */
export function markAsRead(notification: Notification): Notification {
  return { ...notification, read: true };
}

/**
 * Marcar todas las notificaciones como leidas
 */
export function markAllAsRead(notifications: Notification[]): Notification[] {
  return notifications.map((n) => ({ ...n, read: true }));
}

/**
 * Obtener notificaciones ordenadas por fecha (mas recientes primero)
 */
export function sortNotificationsByDate(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Obtener notificaciones del ultimo dia
 */
export function getRecentNotifications(
  notifications: Notification[],
  days: number = 1
): Notification[] {
  const oneDayMs = days * 24 * 60 * 60 * 1000;
  const cutoffTime = Date.now() - oneDayMs;
  return notifications.filter((n) => n.timestamp > cutoffTime);
}
