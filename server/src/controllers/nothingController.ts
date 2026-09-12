import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { NothingSession } from '../models/NothingSession';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { calculateLevel } from '../utils/levelCalculator';
import { getRandomQuote, MILESTONE_MESSAGES } from '../utils/humorQuotes';

export const startSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const startTime = new Date();

    res.status(200).json({
      success: true,
      message: 'Nothing session started. Please cease all productive activities.',
      startTime
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to start session', error: error.message });
  }
};

export const stopSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { startTime, endTime, duration: customDuration } = req.body;

    const start = startTime ? new Date(startTime) : new Date(Date.now() - 1000);
    const end = endTime ? new Date(endTime) : new Date();

    let durationInSeconds = typeof customDuration === 'number' 
      ? Math.max(1, Math.round(customDuration)) 
      : Math.max(1, Math.round((end.getTime() - start.getTime()) / 1000));

    const humorMessage = getRandomQuote();

    // Check if this was a personal record before creating
    const previousLongest = await NothingSession.findOne({ userId: req.user._id })
      .sort({ duration: -1 })
      .select('duration');

    const isNewRecord = previousLongest && durationInSeconds > previousLongest.duration && durationInSeconds >= 30;

    // Save session
    const session = await NothingSession.create({
      userId: req.user._id,
      startTime: start,
      endTime: end,
      duration: durationInSeconds,
      humorMessage
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const oldLevel = user.level || 1;
    user.nothingSessions += 1;
    user.totalNothingTime += durationInSeconds;

    const levelInfo = calculateLevel(user.nothingSessions);
    user.level = levelInfo.level;
    await user.save();

    const notificationsToCreate = [];

    // Session notification if enabled
    if (user.settings.sessionNotifications) {
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;
      const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      notificationsToCreate.push({
        userId: user._id,
        message: `🧘 Nothing session completed (${timeStr}): ${humorMessage}`,
        type: 'session' as const,
        read: false
      });
    }

    // Milestone notification
    if (user.settings.achievementNotifications && MILESTONE_MESSAGES[user.nothingSessions]) {
      notificationsToCreate.push({
        userId: user._id,
        message: MILESTONE_MESSAGES[user.nothingSessions],
        type: 'milestone' as const,
        read: false
      });
    }

    // Level up notification
    if (user.settings.achievementNotifications && levelInfo.level > oldLevel) {
      notificationsToCreate.push({
        userId: user._id,
        message: `🏆 Achievement unlocked: ${levelInfo.title}! ${levelInfo.description}`,
        type: 'level' as const,
        read: false
      });
    }

    // Personal record notification
    if (user.settings.achievementNotifications && isNewRecord) {
      notificationsToCreate.push({
        userId: user._id,
        message: `⏱️ Personal Record Broken! You did nothing continuously for ${Math.round(durationInSeconds / 60)} minutes. Extraordinary lethargy.`,
        type: 'record' as const,
        read: false
      });
    }

    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
    }

    res.status(201).json({
      success: true,
      message: humorMessage,
      session,
      levelUp: levelInfo.level > oldLevel,
      newLevel: levelInfo,
      stats: {
        totalSessions: user.nothingSessions,
        totalNothingTime: user.totalNothingTime,
        level: user.level
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to record session', error: error.message });
  }
};

export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      NothingSession.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NothingSession.countDocuments({ userId: req.user._id })
    ]);

    res.status(200).json({
      success: true,
      sessions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve sessions', error: error.message });
  }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userId = req.user._id;

    // Start of today (midnight)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Today's sessions aggregation
    const todaySessionsAgg = await NothingSession.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: todayStart }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    const todayCount = todaySessionsAgg[0]?.count || 0;
    const todayDuration = todaySessionsAgg[0]?.totalDuration || 0;

    const user = await User.findById(userId);
    const levelInfo = calculateLevel(user?.nothingSessions || 0);

    res.status(200).json({
      success: true,
      stats: {
        todaySessions: todayCount,
        todayNothingTimeSeconds: todayDuration,
        todayNothingTimeMinutes: Math.round(todayDuration / 60),
        totalSessions: user?.nothingSessions || 0,
        totalNothingTimeSeconds: user?.totalNothingTime || 0,
        totalNothingTimeMinutes: Math.round((user?.totalNothingTime || 0) / 60),
        productivityPercentage: 0, // Invariable law of NOTHING
        levelInfo,
        productivityBar: '█░░░░░░░░░░ 0%',
        humorStatus: {
          tasksCompleted: 0,
          thingsAccomplished: 'Also 0',
          thingsNotAccomplished: 'Everything',
          societalImpact: '0%'
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve statistics', error: error.message });
  }
};
