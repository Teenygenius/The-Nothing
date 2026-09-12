import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { NothingSession } from '../models/NothingSession';
import { getAnalyticsInsight } from '../utils/humorQuotes';

export const getDailyAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const range = (req.query.range as string) || '7d';
    const now = new Date();
    let startDate = new Date();
    let daysCount = 7;

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
      daysCount = 1;
    } else if (range === '7d') {
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      daysCount = 7;
    } else if (range === '30d') {
      startDate.setDate(now.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
      daysCount = 30;
    } else {
      // 'all' - default to 60 days back or earliest session
      startDate.setDate(now.getDate() - 59);
      startDate.setHours(0, 0, 0, 0);
      daysCount = 60;
    }

    // Aggregate sessions by day
    const aggregated = await NothingSession.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sessions: { $sum: 1 },
          totalDurationSeconds: { $sum: '$duration' },
          avgDurationSeconds: { $avg: '$duration' },
          maxDurationSeconds: { $max: '$duration' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Map aggregated into a lookup
    const dateMap = new Map<string, any>();
    aggregated.forEach((item: any) => {
      dateMap.set(item._id, {
        sessions: item.sessions,
        minutes: Math.round((item.totalDurationSeconds / 60) * 10) / 10,
        seconds: item.totalDurationSeconds,
        avgMinutes: Math.round((item.avgDurationSeconds / 60) * 10) / 10,
        maxMinutes: Math.round((item.maxDurationSeconds / 60) * 10) / 10
      });
    });

    // Populate all dates in range with zero-fill for smooth continuous charts
    const dailyData = [];
    const loopDate = new Date(startDate);

    for (let i = 0; i < daysCount; i++) {
      const dateStr = loopDate.toISOString().split('T')[0];
      const dayName = loopDate.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = loopDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayStats = dateMap.get(dateStr) || {
        sessions: 0,
        minutes: 0,
        seconds: 0,
        avgMinutes: 0,
        maxMinutes: 0
      };

      dailyData.push({
        date: dateStr,
        label: range === '7d' ? dayName : monthDay,
        sessions: dayStats.sessions,
        minutes: dayStats.minutes,
        seconds: dayStats.seconds,
        avgMinutes: dayStats.avgMinutes
      });

      loopDate.setDate(loopDate.getDate() + 1);
    }

    // Overall summary metrics
    const allSessions = await NothingSession.find({ userId: req.user._id });
    const totalSessions = allSessions.length;
    const totalTimeSeconds = allSessions.reduce((sum: number, s: any) => sum + s.duration, 0);
    const longestSessionSeconds = allSessions.length > 0 ? Math.max(...allSessions.map((s: any) => s.duration)) : 0;
    const avgSessionSeconds = totalSessions > 0 ? Math.round(totalTimeSeconds / totalSessions) : 0;

    const insight = getAnalyticsInsight(totalSessions, Math.round(totalTimeSeconds / 60));

    res.status(200).json({
      success: true,
      range,
      data: dailyData,
      summary: {
        totalSessions,
        totalTimeMinutes: Math.round(totalTimeSeconds / 60),
        totalTimeSeconds,
        longestSessionMinutes: Math.round((longestSessionSeconds / 60) * 10) / 10,
        longestSessionSeconds,
        avgSessionMinutes: Math.round((avgSessionSeconds / 60) * 10) / 10,
        avgSessionSeconds,
        productivityPercentage: 0,
        inactivityPercentage: 100
      },
      insight
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve daily analytics', error: error.message });
  }
};

export const getWeeklyAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Group sessions by day of the week (1=Sunday, 7=Saturday)
    const dayOfWeekData = await NothingSession.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          sessions: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formatted = days.map((day, idx) => {
      const found = dayOfWeekData.find((d: any) => d._id === idx + 1);
      return {
        day,
        sessions: found ? found.sessions : 0,
        minutes: found ? Math.round(found.totalDuration / 60) : 0
      };
    });

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve weekly analytics', error: error.message });
  }
};

export const getMonthlyAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const monthlyData = await NothingSession.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          sessions: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: monthlyData.map((m: any) => ({
        month: m._id,
        sessions: m.sessions,
        minutes: Math.round(m.totalDuration / 60)
      }))
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve monthly analytics', error: error.message });
  }
};
