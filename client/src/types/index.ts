export interface LevelInfo {
  level: number;
  title: string;
  minSessions: number;
  maxSessions: number | null;
  badge: string;
  description: string;
  nextLevelTitle?: string;
  progressPercentage: number;
  sessionsToNextLevel: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  achievementNotifications: boolean;
  sessionNotifications: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  nothingSessions: number;
  totalNothingTime: number; // in seconds
  level: number;
  levelInfo?: LevelInfo;
  settings: UserSettings;
  createdAt: string;
}

export interface NothingSession {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  humorMessage: string;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  message: string;
  type: 'session' | 'milestone' | 'level' | 'record' | 'system';
  read: boolean;
  createdAt: string;
}

export interface NothingStats {
  todaySessions: number;
  todayNothingTimeSeconds: number;
  todayNothingTimeMinutes: number;
  totalSessions: number;
  totalNothingTimeSeconds: number;
  totalNothingTimeMinutes: number;
  productivityPercentage: number;
  levelInfo: LevelInfo;
  productivityBar: string;
  humorStatus: {
    tasksCompleted: number;
    thingsAccomplished: string | number;
    thingsNotAccomplished: string;
    societalImpact: string;
  };
}

export interface DailyDataPoint {
  date: string;
  label: string;
  sessions: number;
  minutes: number;
  seconds: number;
  avgMinutes: number;
}

export interface AnalyticsSummary {
  totalSessions: number;
  totalTimeMinutes: number;
  totalTimeSeconds: number;
  longestSessionMinutes: number;
  longestSessionSeconds: number;
  avgSessionMinutes: number;
  avgSessionSeconds: number;
  productivityPercentage: number;
  inactivityPercentage: number;
}

export interface AnalyticsResponse {
  success: boolean;
  range: string;
  data: DailyDataPoint[];
  summary: AnalyticsSummary;
  insight: string;
}
