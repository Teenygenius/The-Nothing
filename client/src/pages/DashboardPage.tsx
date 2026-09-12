import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { nothingService } from '../services/nothingService';
import { NothingStats, NothingSession } from '../types';
import { NothingButton } from '../components/NothingButton';
import { StatCard } from '../components/StatCard';
import { LevelBadge } from '../components/LevelBadge';
import { LoadingNothing } from '../components/LoadingNothing';
import { formatDurationHuman, formatDate, formatTime } from '../utils/formatters';
import {
  Sparkles,
  Flame,
  Clock,
  CheckCircle,
  TrendingDown,
  History,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState<NothingStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<NothingSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, sessionsRes] = await Promise.all([
        nothingService.getStats(),
        nothingService.getSessions(1, 5)
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        if (user && statsRes.stats.levelInfo) {
          updateUser({
            ...user,
            nothingSessions: statsRes.stats.totalSessions,
            totalNothingTime: statsRes.stats.totalNothingTimeSeconds,
            level: statsRes.stats.levelInfo.level,
            levelInfo: statsRes.stats.levelInfo
          });
        }
      }

      if (sessionsRes.success) {
        setRecentSessions(sessionsRes.sessions);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUser]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSessionComplete = () => {
    fetchDashboardData();
  };

  if (isLoading && !stats) {
    return <LoadingNothing />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Welcome back, {user?.name}.
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            System status: Peak operational non-achievement. Ready to waste time professionally.
          </p>
        </div>

        {/* Level card preview */}
        <div className="md:w-72 bg-white/60 dark:bg-void-900/60 p-3.5 rounded-2xl border border-gray-200 dark:border-void-800">
          <LevelBadge levelInfo={stats?.levelInfo || user?.levelInfo} showProgress={true} />
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Today's Nothing"
          value={`${stats?.todaySessions ?? 0} sessions`}
          subtitle="Moments of total calm"
          icon={<Flame className="w-5 h-5 text-amber-500" />}
          trend="0%"
          trendLabel="stress"
        />

        <StatCard
          title="Nothing Time"
          value={formatDurationHuman(stats?.todayNothingTimeSeconds ?? 0)}
          subtitle="Spent in absolute stillness"
          icon={<Clock className="w-5 h-5 text-indigo-500" />}
          trend="-100%"
          trendLabel="urgency"
        />

        <StatCard
          title="Total Nothing"
          value={`${stats?.totalSessions ?? 0} sessions`}
          subtitle="Lifetime zero-output events"
          icon={<ShieldCheck className="w-5 h-5 text-purple-500" />}
          trend="+0%"
          trendLabel="KPI delta"
        />

        <StatCard
          title="Productivity"
          value="0%"
          subtitle={stats?.productivityBar || '█░░░░░░░░░░ 0%'}
          icon={<TrendingDown className="w-5 h-5 text-emerald-500" />}
          trend="0.00"
          trendLabel="tasks"
        />
      </div>

      {/* Central Section: The Giant Nothing Button */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NothingButton onSessionComplete={handleSessionComplete} />
        </div>

        {/* Right side: Humorous Corporate Status & Insight Card */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-void-800">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-void-800">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                Corporate Audit Report
              </h3>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tasks Completed:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Things Accomplished:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">Also 0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Things Not Accomplished:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Everything</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Societal Impact:</span>
                <span className="font-mono font-bold text-indigo-500">0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Meeting Avoidance Rate:</span>
                <span className="font-mono font-bold text-purple-500">100%</span>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-gray-50 dark:bg-void-900 border border-gray-100 dark:border-void-850 text-xs text-gray-600 dark:text-gray-400 italic text-center">
              "Your performance is statistically insignificant, exactly according to specifications."
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-void-800">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-void-800">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                Lifetime Inactivity Time
              </h3>
            </div>
            <div className="mt-4 text-center">
              <div className="text-3xl font-black font-mono text-gray-900 dark:text-white">
                {formatDurationHuman(stats?.totalNothingTimeSeconds ?? 0)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total hours and minutes dedicated to pure void.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-void-800">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-void-800 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Recent Nothing Activity Log
            </h3>
          </div>
          <span className="text-xs text-gray-400">
            Logged to MongoDB
          </span>
        </div>

        {recentSessions.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500 dark:text-gray-400">
            <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              There is nothing here.
            </p>
            <p className="mt-1">
              Click "DO NOTHING" above to record your first verified session of stillness.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-void-800">
            {recentSessions.map(session => (
              <div
                key={session._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-gray-50/50 dark:hover:bg-void-850/50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🧘</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {session.humorMessage}
                    </p>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(session.createdAt)} at {formatTime(session.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-void-850 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200/50 dark:border-void-800">
                    {formatDurationHuman(session.duration)}
                  </span>
                  <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-sans">
                    <CheckCircle className="w-3 h-3" />
                    Recorded
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
