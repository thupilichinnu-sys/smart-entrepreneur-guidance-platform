import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationItem } from '../types/user';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'userId' | 'timestamp' | 'isRead'>) => void;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refresh = () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setNotifications(notificationService.getNotifications(user.id));
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const markAsRead = (id: string) => {
    if (!user) return;
    notificationService.markAsRead(user.id, id);
    refresh();
  };

  const markAllAsRead = () => {
    if (!user) return;
    notificationService.markAllAsRead(user.id);
    refresh();
  };

  const deleteNotification = (id: string) => {
    if (!user) return;
    notificationService.deleteNotification(user.id, id);
    refresh();
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'userId' | 'timestamp' | 'isRead'>) => {
    if (!user) return;
    notificationService.addNotification(user.id, item);
    refresh();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addNotification,
      refresh
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
