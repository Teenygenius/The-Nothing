import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { NothingSession } from '../models/NothingSession';
import { Notification } from '../models/Notification';
import { calculateLevel } from '../utils/levelCalculator';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const levelInfo = calculateLevel(req.user.nothingSessions);

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        nothingSessions: req.user.nothingSessions,
        totalNothingTime: req.user.totalNothingTime,
        level: req.user.level,
        levelInfo,
        settings: req.user.settings,
        createdAt: req.user.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, avatar, settings } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name.trim();
    if (avatar) user.avatar = avatar;
    if (settings) {
      user.settings = {
        ...user.settings,
        ...settings
      };
    }

    await user.save();
    const levelInfo = calculateLevel(user.nothingSessions);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully with zero additional productivity.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        nothingSessions: user.nothingSessions,
        totalNothingTime: user.totalNothingTime,
        level: user.level,
        levelInfo,
        settings: user.settings,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      return;
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      res.status(400).json({ success: false, message: 'New passwords do not match.' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password || '');
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Incorrect current password.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully. Your nothingness is more secure than ever.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update password.', error: error.message });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userId = req.user._id;

    // Delete all associated data
    await NothingSession.deleteMany({ userId });
    await Notification.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account and all traces of doing nothing deleted permanently. You are truly nothing now.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete account.', error: error.message });
  }
};
