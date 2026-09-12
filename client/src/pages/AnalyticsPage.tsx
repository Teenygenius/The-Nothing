import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsResponse } from '../types';
import { LoadingNothing } from '../components/LoadingNothing';
import { formatDurationHuman } from '../utils/formatters';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingDown,
  Clock,
  Sparkles,
  Calendar,
  ZapOff,
  Flame,
  PieChart as PieIcon
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const res = await analyticsService.getDaily(range);
        if (res.success) {
          setAnalyticsData(res);
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  const summary = analyticsData?.summary;

  const donutData = [
    { name: 'Doing Nothing', value: 100, color: '#6366F1' },
    { name: 'Actual Work', value: 0, color: '#10B981' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-500" />
            Inactivity Analytics & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enterprise analytics charting your steady decline in productive output.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-void-900 border border-gray-200 dark:border-void-800 self-start sm:self-auto">
          {(['today', '7d', '30d', 'all'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                range === r
                  ? 'bg-white dark:bg-void-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Humorous Insights Alert Banner */}
      {analyticsData?.insight && (
        <div className="p-4 sm:p-5 rounded-2xl glass-card border border-indigo-500/30 flex items-start gap-3 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent">
          <Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Executive Telemetry Insight
            </span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
              "{analyticsData.insight}"
            </p>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card rounded-2xl p-5 border border-gray-200 dark:border-void-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Inactivity Sessions
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white">
              {summary?.totalSessions ?? 0}
            </span>
          </div>
          <span className="text-xs text-indigo-500 mt-2 block font-medium">
            Calculated from database
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-200 dark:border-void-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Time Spent
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white">
              {formatDurationHuman(summary?.totalTimeSeconds ?? 0)}
            </span>
          </div>
          <span className="text-xs text-emerald-500 mt-2 block font-medium">
            100% Non-recoverable
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-200 dark:border-void-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Longest Nothing Session
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white">
              {formatDurationHuman(summary?.longestSessionSeconds ?? 0)}
            </span>
          </div>
          <span className="text-xs text-purple-500 mt-2 block font-medium">
            Peak sustained lethargy
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-200 dark:border-void-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Average Session
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white">
              {formatDurationHuman(summary?.avgSessionSeconds ?? 0)}
            </span>
          </div>
          <span className="text-xs text-amber-500 mt-2 block font-medium">
            Consistent disengagement
          </span>
        </div>
      </div>

      {isLoading ? (
        <LoadingNothing />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart 1: Nothing Sessions Over Time (Line Chart) */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-gray-200 dark:border-void-800 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-void-800">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Nothing Sessions Per Day
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Daily frequency of intentional inaction
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-void-850 text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                Frequency
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData?.data || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="label"
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#F9FAFB',
                      fontSize: '12px',
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    name="Sessions"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ fill: '#6366F1', r: 4 }}
                    activeDot={{ r: 6, fill: '#818CF8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Productivity Breakdown (Donut Chart) */}
          <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-void-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-void-800">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Productivity Distribution
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Rigorous ratio of effort vs. void
                  </p>
                </div>
                <PieIcon className="w-4 h-4 text-indigo-500" />
              </div>

              <div className="h-56 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-gray-900 dark:text-white font-mono">
                    100%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-indigo-500">
                    Nothing
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-600" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Doing Absolutely Nothing:</span>
                </div>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">100%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Productive Work:</span>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0%</span>
              </div>
            </div>
          </div>

          {/* Chart 3: Inactivity Duration (Bar Chart) */}
          <div className="lg:col-span-3 glass-card rounded-3xl p-6 border border-gray-200 dark:border-void-800 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-void-800">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Nothing Time Per Day (Minutes)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Total duration subtracted from active work hours
                </p>
              </div>
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData?.data || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="label"
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#F9FAFB',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} mins`, 'Inactivity Duration']}
                  />
                  <Bar
                    dataKey="minutes"
                    name="Minutes Doing Nothing"
                    fill="#10B981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
