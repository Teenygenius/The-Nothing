import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-4 text-center border-t border-gray-200 dark:border-void-800 text-xs text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>🧘</span>
          <span className="font-bold text-gray-700 dark:text-gray-300">NOTHING™</span>
          <span>— Enterprise software system for doing absolutely nothing.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-gray-400">
          <span>Version 1.0.0 (Void Edition)</span>
          <span>•</span>
          <span>Zero Tasks Completed Today</span>
        </div>
      </div>
    </footer>
  );
};
