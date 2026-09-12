import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-void-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="glass-card rounded-3xl p-10 sm:p-14 max-w-lg w-full border border-gray-200 dark:border-void-800 shadow-2xl relative overflow-hidden">
        <div className="text-6xl mb-4">🧘</div>
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold mb-4">
          HTTP 404
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          404 — You found nothing.
        </h1>
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-2">
          "There is nothing here. Exactly as intended."
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          The page you requested has achieved absolute non-existence. Do not panic; this is peak enterprise compliance.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Doing Nothing
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl glass-card text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};
