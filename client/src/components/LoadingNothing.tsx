import React, { useState, useEffect } from 'react';
import { getRandomLoadingMessage } from '../utils/humor';
import { Loader2 } from 'lucide-react';

export const LoadingNothing: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = false }) => {
  const [message, setMessage] = useState(getRandomLoadingMessage());

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(getRandomLoadingMessage());
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-200 dark:border-void-800 border-t-indigo-600 dark:border-t-indigo-500 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">
          🧘
        </span>
      </div>
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 animate-pulse">
        {message}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Doing absolutely nothing is computationally intensive.
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 dark:bg-void-950/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};
