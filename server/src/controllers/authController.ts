import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { calculateLevel } from '../utils/levelCalculator';
import { AuthRequest } from '../middleware/authMiddleware';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'nothing_super_secret_enterprise_void_jwt_key_2026';
  return jwt.sign({ userId }, secret, { expiresIn: '30d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: 'sloth',
      nothingSessions: 0,
      totalNothingTime: 0,
      level: 1,
      settings: {
        theme: 'dark',
        notificationsEnabled: true,
        achievementNotifications: true,
        sessionNotifications: true
      }
    });

    // Create welcome notification
    await Notification.create({
      userId: user._id,
      message: '🎉 Welcome to NOTHING! You have taken the first step toward supreme inaction.',
      type: 'milestone',
      read: false
    });

    const token = generateToken(user._id.toString());
    const levelInfo = calculateLevel(0);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to doing absolutely nothing.',
      token,
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
    res.status(500).json({ success: false, message: 'Registration failed.', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user._id.toString());
    const levelInfo = calculateLevel(user.nothingSessions);

    res.status(200).json({
      success: true,
      message: 'Login successful. Ready to do nothing.',
      token,
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
    res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
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
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.', error: error.message });
  }
};
