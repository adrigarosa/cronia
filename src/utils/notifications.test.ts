import { describe, it, expect } from 'vitest';
import {
  createTaskReminderNotification,
  createHabitReminderNotification,
  createMilestoneNotification,
  createInfoNotification,
  isValidNotification,
  groupNotificationsByType,
  getUnreadNotifications,
  countUnreadNotifications,
  markAsRead,
  markAllAsRead,
  sortNotificationsByDate,
  getRecentNotifications,
} from './notifications';

describe('Notification System', () => {
  describe('Create Notifications', () => {
    it('should create task reminder notification', () => {
      const notif = createTaskReminderNotification('task1', 'Complete project');
      expect(notif.type).toBe('task_reminder');
      expect(notif.title).toBe('Recordatorio de Tarea');
      expect(notif.body).toContain('Complete project');
      expect(notif.read).toBe(false);
    });

    it('should create habit reminder notification', () => {
      const notif = createHabitReminderNotification('habit1', 'Exercise');
      expect(notif.type).toBe('habit_reminder');
      expect(notif.title).toBe('Recordatorio de Habito');
      expect(notif.body).toContain('Exercise');
    });

    it('should create milestone notification', () => {
      const notif = createMilestoneNotification('100 tasks', 'You reached 100 completed tasks');
      expect(notif.type).toBe('milestone');
      expect(notif.title).toContain('Felicidades');
      expect(notif.body).toContain('100 tasks');
    });

    it('should create info notification', () => {
      const notif = createInfoNotification('App Update', 'Version 1.1.0 available');
      expect(notif.type).toBe('info');
      expect(notif.title).toBe('App Update');
      expect(notif.body).toBe('Version 1.1.0 available');
    });
  });

  describe('Validate Notification', () => {
    it('should validate correct notification', () => {
      const notif = createTaskReminderNotification('task1', 'Test');
      expect(isValidNotification(notif)).toBe(true);
    });

    it('should reject notification without id', () => {
      const notif = {
        type: 'task_reminder',
        title: 'Test',
        body: 'Test body',
        timestamp: Date.now(),
        read: false,
      };
      expect(isValidNotification(notif)).toBe(false);
    });

    it('should reject notification with invalid type', () => {
      const notif = {
        id: '1',
        type: 'invalid_type',
        title: 'Test',
        body: 'Test body',
        timestamp: Date.now(),
        read: false,
      };
      expect(isValidNotification(notif)).toBe(false);
    });

    it('should reject null notification', () => {
      expect(isValidNotification(null)).toBe(false);
    });
  });

  describe('Group Notifications', () => {
    it('should group notifications by type', () => {
      const notifs = [
        createTaskReminderNotification('task1', 'Task 1'),
        createTaskReminderNotification('task2', 'Task 2'),
        createHabitReminderNotification('habit1', 'Habit 1'),
      ];

      const grouped = groupNotificationsByType(notifs);
      expect(grouped.task_reminder).toHaveLength(2);
      expect(grouped.habit_reminder).toHaveLength(1);
    });
  });

  describe('Unread Notifications', () => {
    it('should get unread notifications', () => {
      const notifs = [
        createTaskReminderNotification('task1', 'Task 1'),
        createHabitReminderNotification('habit1', 'Habit 1'),
      ];

      const unread = getUnreadNotifications(notifs);
      expect(unread).toHaveLength(2);
    });

    it('should count unread notifications', () => {
      const notifs = [
        createTaskReminderNotification('task1', 'Task 1'),
        createHabitReminderNotification('habit1', 'Habit 1'),
      ];

      expect(countUnreadNotifications(notifs)).toBe(2);
    });

    it('should not count read notifications', () => {
      let notif = createTaskReminderNotification('task1', 'Task 1');
      notif = markAsRead(notif);

      expect(countUnreadNotifications([notif])).toBe(0);
    });
  });

  describe('Mark As Read', () => {
    it('should mark single notification as read', () => {
      let notif = createTaskReminderNotification('task1', 'Task 1');
      expect(notif.read).toBe(false);

      notif = markAsRead(notif);
      expect(notif.read).toBe(true);
    });

    it('should mark all notifications as read', () => {
      const notifs = [
        createTaskReminderNotification('task1', 'Task 1'),
        createHabitReminderNotification('habit1', 'Habit 1'),
      ];

      const marked = markAllAsRead(notifs);
      expect(marked.every((n) => n.read)).toBe(true);
    });
  });

  describe('Sort Notifications', () => {
    it('should sort by date descending', () => {
      const now = Date.now();
      const notif1 = createTaskReminderNotification('task1', 'Task 1');
      notif1.timestamp = now - 1000; // 1 second ago

      const notif2 = createTaskReminderNotification('task2', 'Task 2');
      notif2.timestamp = now; // now

      const sorted = sortNotificationsByDate([notif1, notif2]);
      expect(sorted[0].timestamp).toBeGreaterThan(sorted[1].timestamp);
    });
  });

  describe('Recent Notifications', () => {
    it('should get notifications from last day', () => {
      const now = Date.now();
      const notif1 = createTaskReminderNotification('task1', 'Task 1');
      notif1.timestamp = now - 1000; // 1 second ago

      const notif2 = createTaskReminderNotification('task2', 'Task 2');
      notif2.timestamp = now - 48 * 60 * 60 * 1000; // 2 days ago

      const recent = getRecentNotifications([notif1, notif2]);
      expect(recent).toHaveLength(1);
      expect(recent[0].data?.taskId).toBe('task1');
    });
  });

  describe('Notification Types', () => {
    it('should support task_reminder type', () => {
      const notif = createTaskReminderNotification('task1', 'Task 1');
      expect(notif.type).toBe('task_reminder');
    });

    it('should support habit_reminder type', () => {
      const notif = createHabitReminderNotification('habit1', 'Habit 1');
      expect(notif.type).toBe('habit_reminder');
    });

    it('should support milestone type', () => {
      const notif = createMilestoneNotification('Achievement', 'Details');
      expect(notif.type).toBe('milestone');
    });

    it('should support info type', () => {
      const notif = createInfoNotification('Title', 'Body');
      expect(notif.type).toBe('info');
    });
  });
});
