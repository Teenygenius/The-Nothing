import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { X, Trophy, Bell, Award, Timer, Sparkles } from 'lucide-react';

export const NotificationToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'level':
        return <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />;
      case 'milestone':
        return <Award className="w-5 h-5 text-indigo-400" />;
      case 'record':
        return <Timer className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl bg-white/95 dark:bg-void-900/95 border border-indigo-500/30 backdrop-blur-md text-gray-900 dark:text-gray-100 transform transition-all duration-300 animate-in slide-in-from-bottom-5"
        >
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex-shrink-0">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {toast.type === 'level' ? 'Level Unlocked' : toast.type === 'record' ? 'Personal Record' : 'Nothing Update'}
            </p>
            <p className="text-sm font-medium mt-0.5 leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
