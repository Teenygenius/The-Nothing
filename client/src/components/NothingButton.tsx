import React, { useState, useEffect, useRef } from 'react';
import { nothingService } from '../services/nothingService';
import { useNotifications } from '../context/NotificationContext';
import { formatStopwatch } from '../utils/formatters';
import confetti from 'canvas-confetti';
import { Play, Square, Sparkles, Zap } from 'lucide-react';

interface NothingButtonProps {
  onSessionComplete: (data: any) => void;
}

export const NothingButton: React.FC<NothingButtonProps> = ({ onSessionComplete }) => {
  const { showToast, refreshNotifications } = useNotifications();
  const [isActiveSession, setIsActiveSession] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mode, setMode] = useState<'instant' | 'timed'>('timed');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActiveSession) {
      timerRef.current = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActiveSession]);

  const handleStartTimedSession = async () => {
    try {
      const now = new Date();
      setSessionStartTime(now);
      setSessionSeconds(0);
      setIsActiveSession(true);
      await nothingService.startSession();
      showToast('Session started. Please do not accomplish anything.', 'session');
    } catch (err: any) {
      showToast(err.message || 'Failed to start session', 'system');
    }
  };

  const handleStopTimedSession = async () => {
    if (!isActiveSession) return;
    setIsSubmitting(true);

    try {
      const endTime = new Date();
      const duration = Math.max(1, sessionSeconds);

      const res = await nothingService.stopSession({
        startTime: sessionStartTime?.toISOString(),
        endTime: endTime.toISOString(),
        duration,
      });

      setIsActiveSession(false);
      setSessionSeconds(0);
      setSessionStartTime(null);

      if (res.levelUp) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        showToast(`🏆 LEVEL UP! You reached Level ${res.newLevel.level}: ${res.newLevel.title}!`, 'level');
      } else {
        showToast(res.message, 'session');
      }

      await refreshNotifications();
      onSessionComplete(res);
    } catch (err: any) {
      showToast(err.message || 'Failed to record session', 'system');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantNothing = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await nothingService.stopSession({
        duration: Math.floor(Math.random() * 15) + 5, // 5 to 20 seconds simulated instant moment
      });

      if (res.levelUp) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        showToast(`🏆 LEVEL UP! You reached Level ${res.newLevel.level}: ${res.newLevel.title}!`, 'level');
      } else {
        showToast(res.message, 'session');
      }

      await refreshNotifications();
      onSessionComplete(res);
    } catch (err: any) {
      showToast(err.message || 'Failed to record instant nothing', 'system');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative glass-card rounded-3xl p-8 sm:p-12 text-center overflow-hidden border border-indigo-500/20 shadow-2xl">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Mode toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-void-850 border border-gray-200 dark:border-void-800">
          <button
            onClick={() => {
              if (!isActiveSession) setMode('timed');
            }}
            disabled={isActiveSession}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              mode === 'timed'
                ? 'bg-white dark:bg-void-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Live Stopwatch
          </button>
          <button
            onClick={() => {
              if (!isActiveSession) setMode('instant');
            }}
            disabled={isActiveSession}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              mode === 'instant'
                ? 'bg-white dark:bg-void-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Instant Moment
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-gray-800 dark:text-gray-200">
          DO ABSOLUTELY NOTHING
        </h2>

        {/* Big Zen Icon with glowing aura */}
        <div className="my-8 relative">
          {isActiveSession && (
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse-ring scale-150" />
          )}
          <div
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center text-5xl sm:text-6xl select-none transition-all duration-500 shadow-xl ${
              isActiveSession
                ? 'bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 glow-zen scale-105'
                : 'bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-500 hover:scale-105'
            }`}
          >
            🧘
          </div>
        </div>

        {/* Live Timer or Status */}
        <div className="mb-8">
          {mode === 'timed' ? (
            isActiveSession ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium uppercase tracking-wider text-emerald-500 animate-pulse">
                  Session Active • Do Not Move
                </span>
                <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {formatStopwatch(sessionSeconds)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Currently doing nothing for: {sessionSeconds} second{sessionSeconds !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Ready to disengage
                </span>
                <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-gray-400 dark:text-gray-500">
                  00:00:00
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Click below to begin doing absolutely nothing
                </span>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-500">
                Single Click Execution
              </span>
              <span className="text-base text-gray-600 dark:text-gray-300 max-w-sm">
                Log a moment of pure inactivity with one enterprise-grade click.
              </span>
            </div>
          )}
        </div>

        {/* The Action Button */}
        {mode === 'timed' ? (
          !isActiveSession ? (
            <button
              onClick={handleStartTimedSession}
              disabled={isSubmitting}
              className="px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-extrabold text-lg sm:text-xl tracking-wider uppercase shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 group"
            >
              <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              DO NOTHING
            </button>
          ) : (
            <button
              onClick={handleStopTimedSession}
              disabled={isSubmitting}
              className="px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-lg sm:text-xl tracking-wider uppercase shadow-xl hover:shadow-rose-500/25 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 animate-pulse"
            >
              <Square className="w-5 h-5 fill-white" />
              {isSubmitting ? 'Recording Nothing...' : 'STOP DOING NOTHING'}
            </button>
          )
        ) : (
          <button
            onClick={handleInstantNothing}
            disabled={isSubmitting}
            className="px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-lg sm:text-xl tracking-wider uppercase shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5" />
            {isSubmitting ? 'Doing Nothing...' : 'DO NOTHING NOW'}
          </button>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 max-w-xs leading-relaxed">
          Warning: Prolonged use may result in profound peace of mind and complete disregard for deadlines.
        </p>
      </div>
    </div>
  );
};
