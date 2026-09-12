import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { authService } from '../services/authService';
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Bell,
  Trash2,
  Lock,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Save
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  // Notification Preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.settings?.notificationsEnabled ?? true
  );
  const [achievementNotifications, setAchievementNotifications] = useState(
    user?.settings?.achievementNotifications ?? true
  );
  const [sessionNotifications, setSessionNotifications] = useState(
    user?.settings?.sessionNotifications ?? true
  );
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Delete Account Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingSettings(true);
      const res = await authService.updateProfile({
        settings: {
          theme,
          notificationsEnabled,
          achievementNotifications,
          sessionNotifications,
        }
      });

      if (res.success && res.user) {
        updateUser(res.user);
        showToast('Settings saved successfully.', 'session');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'system');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    try {
      setIsDeletingAccount(true);
      const res = await authService.deleteAccount();
      if (res.success) {
        logout();
        navigate('/');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete account', 'system');
      setIsDeletingAccount(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-indigo-500" />
          Settings & System Preferences
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize your experience of total void, theme toggles, and notification alerts.
        </p>
      </div>

      {/* 1. Appearance Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-void-800">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          Appearance & Void Atmosphere
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Select the visual aesthetic for your non-working sessions. Dark mode is strongly recommended.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
              theme === 'light'
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-md'
                : 'border-gray-200 dark:border-void-800 hover:bg-gray-50 dark:hover:bg-void-850'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sun className="w-6 h-6 text-amber-500" />
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Light Mode</p>
              <p className="text-[11px] text-gray-400">Clean, bright inactivity</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-md'
                : 'border-gray-200 dark:border-void-800 hover:bg-gray-50 dark:hover:bg-void-850'
            }`}
          >
            <div className="flex items-center justify-between">
              <Moon className="w-6 h-6 text-indigo-400" />
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Dark Mode (Default)</p>
              <p className="text-[11px] text-gray-400">The true enterprise void</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
              theme === 'system'
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-md'
                : 'border-gray-200 dark:border-void-800 hover:bg-gray-50 dark:hover:bg-void-850'
            }`}
          >
            <div className="flex items-center justify-between">
              <Monitor className="w-6 h-6 text-emerald-500" />
              {theme === 'system' && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">System Preference</p>
              <p className="text-[11px] text-gray-400">Sync with your OS</p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <form onSubmit={handleSavePreferences} className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-void-800 space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            Notification Preferences
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Control when the void communicates with you.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-void-900 border border-gray-100 dark:border-void-850 cursor-pointer">
            <div>
              <span className="text-sm font-bold text-gray-900 dark:text-white block">
                Enable Notifications
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Master switch for all platform toasts and updates
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={e => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-void-900 border border-gray-100 dark:border-void-850 cursor-pointer">
            <div>
              <span className="text-sm font-bold text-gray-900 dark:text-white block">
                Achievement & Level-Up Notifications
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Receive celebratory alerts when unlocking new Nothing ranks
              </span>
            </div>
            <input
              type="checkbox"
              disabled={!notificationsEnabled}
              checked={achievementNotifications && notificationsEnabled}
              onChange={e => setAchievementNotifications(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-void-900 border border-gray-100 dark:border-void-850 cursor-pointer">
            <div>
              <span className="text-sm font-bold text-gray-900 dark:text-white block">
                Session Completion Alerts
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Show humorous quotes each time you finish doing nothing
              </span>
            </div>
            <input
              type="checkbox"
              disabled={!notificationsEnabled}
              checked={sessionNotifications && notificationsEnabled}
              onChange={e => setSessionNotifications(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSavingSettings}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSavingSettings ? 'Saving...' : 'Save Notification Preferences'}
        </button>
      </form>

      {/* 3. Account Actions & Danger Zone */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/20 space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Account Management & Danger Zone
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sign out or permanently purge all records of your inactivity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-void-900 border border-gray-100 dark:border-void-850">
          <div>
            <span className="text-sm font-bold text-gray-900 dark:text-white block">
              Sign Out of Session
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Clear your authentication token and return to the login screen
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gray-200 dark:bg-void-800 hover:bg-gray-300 dark:hover:bg-void-700 text-gray-800 dark:text-gray-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
          <div>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 block">
              Delete Account Permanently
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Permanently destroy your profile, all Nothing sessions, and notifications.
            </span>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-500/30 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-black text-center text-gray-900 dark:text-white">
              Delete All Traces of Inactivity?
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 leading-relaxed">
              This action cannot be undone. All your Nothing sessions, total wasted time, level progression, and notifications will be wiped from the database.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 text-center">
                Type <span className="font-mono font-bold text-rose-500">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full text-center px-4 py-2 rounded-xl bg-gray-50 dark:bg-void-900 border border-gray-200 dark:border-void-800 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-void-800 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-void-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || isDeletingAccount}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-rose-600/20 transition-all"
              >
                {isDeletingAccount ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
