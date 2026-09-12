import React from 'react';
import { LevelInfo } from '../types';

interface LevelBadgeProps {
  levelInfo?: LevelInfo;
  showProgress?: boolean;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ levelInfo, showProgress = true }) => {
  if (!levelInfo) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="badge">
            {levelInfo.badge}
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                Level {levelInfo.level}
              </span>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                {levelInfo.title}
              </h4>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {levelInfo.description}
            </p>
          </div>
        </div>
      </div>

      {showProgress && levelInfo.nextLevelTitle && (
        <div className="w-full mt-1">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress to {levelInfo.nextLevelTitle}</span>
            <span>{levelInfo.progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-void-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${levelInfo.progressPercentage}%` }}
            />
          </div>
          <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 text-right">
            {levelInfo.sessionsToNextLevel} session{levelInfo.sessionsToNextLevel !== 1 ? 's' : ''} to rank up
          </div>
        </div>
      )}
    </div>
  );
};
