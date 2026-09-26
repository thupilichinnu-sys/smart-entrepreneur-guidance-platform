import { NotificationItem } from '../types/user';
import { storageService } from './storageService';

export const notificationService = {
  getNotifications(userId: string): NotificationItem[] {
    return storageService.getItem<NotificationItem[]>(userId, 'notifications', []);
  },

  addNotification(userId: string, notif: Omit<NotificationItem, 'id' | 'userId' | 'timestamp' | 'isRead'>): NotificationItem {
    const current = this.getNotifications(userId);
    const item: NotificationItem = {
      ...notif,
      id: 'notif_' + Date.now(),
      userId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    storageService.setItem(userId, 'notifications', [item, ...current]);
    return item;
  },

  markAsRead(userId: string, notifId: string): void {
    const current = this.getNotifications(userId);
    const updated = current.map(n => n.id === notifId ? { ...n, isRead: true } : n);
    storageService.setItem(userId, 'notifications', updated);
  },

  markAllAsRead(userId: string): void {
    const current = this.getNotifications(userId);
    const updated = current.map(n => ({ ...n, isRead: true }));
    storageService.setItem(userId, 'notifications', updated);
  },

  deleteNotification(userId: string, notifId: string): void {
    const current = this.getNotifications(userId);
    const updated = current.filter(n => n.id !== notifId);
    storageService.setItem(userId, 'notifications', updated);
  }
};
