import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { AVATAR_OPTIONS } from '../utils/humor';
import {
  Sun,
  Moon,
  Bell,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Menu,
  CheckCheck,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === user?.avatar)?.icon || '🧘';

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-gray-200 dark:border-void-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile menu & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-void-800"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🧘</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-wider text-gray-900 dark:text-white">
                  NOTHING
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
                  VOID
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Meaningless Productivity Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-void-850 border border-gray-200 dark:border-void-800 text-xs text-gray-600 dark:text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Productivity Index:</span>
          <span className="font-mono font-bold text-gray-900 dark:text-white">0.00%</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-void-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Notifications dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-void-800 relative transition-colors"
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-card shadow-2xl border border-gray-200 dark:border-void-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-4 border-b border-gray-100 dark:border-void-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-void-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400">
                      There are no notifications. Pure nothingness.
                    </div>
                  ) : (
                    notifications.slice(0, 5).map(notif => (
                      <div
                        key={notif._id}
                        className={`p-3.5 text-xs transition-colors flex items-start justify-between gap-2 ${
                          notif.read
                            ? 'bg-transparent text-gray-600 dark:text-gray-400'
                            : 'bg-indigo-50/50 dark:bg-indigo-950/20 text-gray-900 dark:text-white font-medium'
                        }`}
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => !notif.read && markAsRead(notif._id)}
                        >
                          <p>{notif.message}</p>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteNotification(notif._id)}
                          className="text-gray-400 hover:text-rose-500 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-gray-50 dark:bg-void-900 border-t border-gray-100 dark:border-void-800 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    View all notifications
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-void-800 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-void-800 flex items-center justify-center text-lg border border-indigo-500/30">
                {currentAvatar}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[100px] truncate">
                {user?.name}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card shadow-2xl border border-gray-200 dark:border-void-800 overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-gray-100 dark:border-void-800">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold">
                    <span>{user?.levelInfo?.badge || '🌱'}</span>
                    <span>Level {user?.level}: {user?.levelInfo?.title || 'Amateur Nothing'}</span>
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-void-800 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  Your Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-void-800 transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-gray-400" />
                  Settings
                </Link>

                <div className="border-t border-gray-100 dark:border-void-800 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
