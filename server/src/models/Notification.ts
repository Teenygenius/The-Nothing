import mongoose, { Document, Schema } from 'mongoose';
import { MemoryNotification } from '../config/memoryStore';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  message: string;
  type: 'session' | 'milestone' | 'level' | 'record' | 'system';
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['session', 'milestone', 'level', 'record', 'system'],
      default: 'session',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });

const MongooseNotification = mongoose.model<INotification>('Notification', NotificationSchema);

// Dual-mode proxy: Uses real Mongoose when connected, or MemoryStore if offline
export const Notification: any = new Proxy(MongooseNotification, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState === 1) {
      return Reflect.get(target, prop, receiver);
    }
    return (MemoryNotification as any)[prop] || Reflect.get(target, prop, receiver);
  },
});
