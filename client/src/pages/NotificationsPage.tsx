import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { formatDate, formatTime } from '../utils/formatters';
import {
  Bell,
  CheckCheck,
  Trash2,
  Trophy,
  Award,
  Timer,
  Sparkles,
  Inbox,
  Filter
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isLoading
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'achievements') return n.type === 'milestone' || n.type === 'level' || n.type === 'record';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'level':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'milestone':
        return <Award className="w-5 h-5 text-indigo-500" />;
      case 'record':
        return <Timer className="w-5 h-5 text-emerald-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-indigo-500" />
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time corporate notifications regarding your complete disengagement.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-100 dark:bg-void-900 border border-gray-200 dark:border-void-800 w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-white dark:bg-void-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'unread'
              ? 'bg-white dark:bg-void-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('achievements')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'achievements'
              ? 'bg-white dark:bg-void-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Achievements & Levels
        </button>
      </div>

      {/* Notifications List Card */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-gray-200 dark:border-void-800 shadow-xl">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-void-850 text-indigo-500 mx-auto flex items-center justify-center text-3xl mb-4">
              <Inbox className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              There is nothing here.
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              Exactly as intended. No pending duties, no urgent pings, pure unbroken stillness.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-void-800">
            {filteredNotifications.map(notification => (
              <div
                key={notification._id}
                className={`py-4 px-3 sm:px-4 rounded-2xl flex items-start justify-between gap-4 transition-colors ${
                  notification.read
                    ? 'bg-transparent text-gray-600 dark:text-gray-400'
                    : 'bg-indigo-50/50 dark:bg-indigo-950/20 text-gray-900 dark:text-white font-medium'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-void-850 border border-gray-200 dark:border-void-800 flex-shrink-0 shadow-sm">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-void-800 text-gray-600 dark:text-gray-400">
                        {notification.type}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <p className="text-sm leading-relaxed break-words">
                      {notification.message}
                    </p>
                    <span className="text-[11px] text-gray-400 mt-2 block font-mono">
                      {formatDate(notification.createdAt)} at {formatTime(notification.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-void-800 text-xs font-semibold"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
