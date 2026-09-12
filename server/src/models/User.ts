import mongoose, { Document, Schema } from 'mongoose';
import { MemoryUser } from '../config/memoryStore';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  nothingSessions: number;
  totalNothingTime: number; // in seconds
  level: number;
  settings: {
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
    achievementNotifications: boolean;
    sessionNotifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    avatar: {
      type: String,
      default: 'sloth',
    },
    nothingSessions: {
      type: Number,
      default: 0,
    },
    totalNothingTime: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'dark',
      },
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      achievementNotifications: {
        type: Boolean,
        default: true,
      },
      sessionNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const MongooseUser = mongoose.model<IUser>('User', UserSchema);

// Dual-mode proxy: Uses real Mongoose when connected, or MemoryStore if offline
export const User: any = new Proxy(MongooseUser, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState === 1) {
      return Reflect.get(target, prop, receiver);
    }
    return (MemoryUser as any)[prop] || Reflect.get(target, prop, receiver);
  },
});
