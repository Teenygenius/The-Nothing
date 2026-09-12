import { request } from './api';
import { NothingSession, NothingStats } from '../types';

export const nothingService = {
  startSession: async () => {
    return request<{ success: boolean; message: string; startTime: string }>('/nothing/start', {
      method: 'POST',
    });
  },

  stopSession: async (data: { startTime?: string; endTime?: string; duration?: number }) => {
    return request<{
      success: boolean;
      message: string;
      session: NothingSession;
      levelUp: boolean;
      newLevel: any;
      stats: { totalSessions: number; totalNothingTime: number; level: number };
    }>('/nothing/stop', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSessions: async (page = 1, limit = 20) => {
    return request<{
      success: boolean;
      sessions: NothingSession[];
      pagination: { total: number; page: number; limit: number; pages: number };
    }>(`/nothing/sessions?page=${page}&limit=${limit}`);
  },

  getStats: async () => {
    return request<{ success: boolean; stats: NothingStats }>('/nothing/stats');
  },
};
