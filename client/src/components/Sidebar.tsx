import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  LayoutDashboard,
  User,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  X,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 glass-panel border-r border-gray-200 dark:border-void-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header brand in sidebar */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-void-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧘</span>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-wider text-gray-900 dark:text-white">
                  NOTHING
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Enterprise Suite
                </span>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-void-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation links */}
          <div className="p-4 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 py-2">
              Platform Menu
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-void-800/80 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 dark:bg-indigo-900/60 dark:text-indigo-300">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom user card & logout */}
        <div className="p-4 border-t border-gray-200 dark:border-void-800 space-y-3">
          {/* Meaningless SLA info */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-void-850 border border-gray-100 dark:border-void-800 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <div className="leading-tight">
              <span className="font-semibold text-gray-800 dark:text-gray-200">99.99% Inactivity</span>
              <p className="text-[10px] text-gray-400">Zero work SLA active</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
