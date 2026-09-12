import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-void-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 relative overflow-hidden">
      {/* Background aesthetic blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            🧘
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-wider text-gray-900 dark:text-white">
                NOTHING
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
                SaaS
              </span>
            </div>
          </div>
        </Link>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-void-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </header>

      {/* Main card content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-gray-400 relative z-10">
        Enterprise Inactivity Platform • Guaranteed 0% Productivity
      </footer>
    </div>
  );
};
