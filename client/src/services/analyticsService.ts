import { request } from './api';
import { AnalyticsResponse } from '../types';

export const analyticsService = {
  getDaily: async (range: 'today' | '7d' | '30d' | 'all' = '7d') => {
    return request<AnalyticsResponse>(`/analytics/daily?range=${range}`);
  },

  getWeekly: async () => {
    return request<{ success: boolean; data: { day: string; sessions: number; minutes: number }[] }>('/analytics/weekly');
  },

  getMonthly: async () => {
    return request<{ success: boolean; data: { month: string; sessions: number; minutes: number }[] }>('/analytics/monthly');
  },
};
