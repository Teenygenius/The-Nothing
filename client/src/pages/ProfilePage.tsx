import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { authService } from '../services/authService';
import { AVATAR_OPTIONS } from '../utils/humor';
import { formatDurationHuman, formatDate } from '../utils/formatters';
import { LevelBadge } from '../components/LevelBadge';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  Save,
  Lock,
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotifications();

  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'sloth');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsUpdatingProfile(true);
      const res = await authService.updateProfile({
        name: name.trim(),
        avatar: selectedAvatar,
      });

      if (res.success && res.user) {
        updateUser(res.user);
        showToast('Profile updated. Zero productivity preserved.', 'session');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'system');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await authService.updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setPasswordSuccess(res.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Password changed successfully.', 'session');
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const currentAvatarInfo = AVATAR_OPTIONS.find(a => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          User Profile & Inactivity Status
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review your credentials, select your spirit non-doer avatar, and manage security.
        </p>
      </div>

      {/* Main Profile Identity Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-void-800">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-gray-100 dark:border-void-800">
          <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-void-850 border-2 border-indigo-500/30 flex items-center justify-center text-5xl shadow-xl flex-shrink-0">
            {currentAvatarInfo.icon}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {user?.email}
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
              Professional Status: Currently doing absolutely nothing.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Joined: {formatDate(user?.createdAt || new Date().toISOString())}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Verified Non-Achiever
              </span>
            </div>
          </div>
        </div>

        {/* Level Progression Section */}
        <div className="pt-6">
          <LevelBadge levelInfo={user?.levelInfo} showProgress={true} />
        </div>
      </div>

      {/* Lifetime Stats & Humorous Certificate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-void-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Inactivity Statistics
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-void-800">
              <span className="text-gray-500 dark:text-gray-400">Total Nothing Sessions:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{user?.nothingSessions ?? 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-void-800">
              <span className="text-gray-500 dark:text-gray-400">Total Nothing Time:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {formatDurationHuman(user?.totalNothingTime ?? 0)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-void-800">
              <span className="text-gray-500 dark:text-gray-400">Nothing Rank:</span>
              <span className="font-semibold text-indigo-500">Level {user?.level}: {user?.levelInfo?.title}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 dark:text-gray-400">Tasks Successfully Evaded:</span>
              <span className="font-mono font-bold text-emerald-500">All of them</span>
            </div>
          </div>
        </div>

        {/* Humorous Certificate Preview */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent text-center relative overflow-hidden flex flex-col justify-between">
          <div className="border border-dashed border-amber-500/40 p-4 rounded-2xl">
            <div className="text-2xl mb-1">📜</div>
            <h4 className="text-xs font-black tracking-widest uppercase text-amber-600 dark:text-amber-400">
              CERTIFICATE OF PURE INACTIVITY
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-2 italic">
              "This certifies that {user?.name} has officially dedicated {formatDurationHuman(user?.totalNothingTime ?? 0)} to the noble pursuit of producing strictly zero tangible output."
            </p>
            <div className="mt-4 pt-2 border-t border-amber-500/20 flex justify-between items-center text-[10px] text-gray-400 font-mono">
              <span>Status: Certified Void</span>
              <span>Level {user?.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Details Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-void-800">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-indigo-500" />
          Edit Profile Information
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-void-900 border border-gray-200 dark:border-void-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
              Choose Avatar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
              {AVATAR_OPTIONS.map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedAvatar(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedAvatar === opt.id
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                      : 'border-gray-200 dark:border-void-800 hover:bg-gray-50 dark:hover:bg-void-850'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{opt.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-void-800">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-500" />
          Update Security Password
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Ensure your inactivity is protected by robust cryptographic hashing.
        </p>

        {passwordError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-void-900 border border-gray-200 dark:border-void-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-void-900 border border-gray-200 dark:border-void-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-void-900 border border-gray-200 dark:border-void-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
