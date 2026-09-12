import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Notification } from '../models/Notification';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50),
      Notification.countDocuments({ userId: req.user._id, read: false })
    ]);

    res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve notifications', error: error.message });
  }
};

export const markRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });

    res.status(200).json({
      success: true,
      notification,
      unreadCount
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update notification', error: error.message });
  }
};

export const markAllRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
      unreadCount: 0
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to mark all as read', error: error.message });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });

    res.status(200).json({
      success: true,
      message: 'Notification deleted into nothingness.',
      unreadCount
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete notification', error: error.message });
  }
};
