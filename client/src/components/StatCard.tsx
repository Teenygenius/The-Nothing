import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendLabel?: string;
  isNegativeTrendGood?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend = '0%',
  trendLabel = 'productivity',
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-void-800 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-mono">
          {value}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400 truncate">
          {subtitle || 'Verified Inactivity'}
        </span>
        <div className="flex items-center gap-1 font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
          <span>{trend}</span>
          <span className="text-[10px] text-gray-400">{trendLabel}</span>
        </div>
      </div>
    </div>
  );
};
