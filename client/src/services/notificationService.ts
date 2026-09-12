import { request } from './api';
import { NotificationItem } from '../types';

export const notificationService = {
  getNotifications: async () => {
    return request<{
      success: boolean;
      notifications: NotificationItem[];
      unreadCount: number;
    }>('/notifications');
  },

  markRead: async (id: string) => {
    return request<{
      success: boolean;
      notification: NotificationItem;
      unreadCount: number;
    }>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  markAllRead: async () => {
    return request<{
      success: boolean;
      message: string;
      unreadCount: number;
    }>('/notifications/read-all', {
      method: 'PUT',
    });
  },

  deleteNotification: async (id: string) => {
    return request<{
      success: boolean;
      message: string;
      unreadCount: number;
    }>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};
