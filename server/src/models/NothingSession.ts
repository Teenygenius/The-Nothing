import mongoose, { Document, Schema } from 'mongoose';
import { MemoryNothingSession } from '../config/memoryStore';

export interface INothingSession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  humorMessage: string;
  createdAt: Date;
}

const NothingSessionSchema = new Schema<INothingSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    humorMessage: {
      type: String,
      default: 'Nothing completed successfully.',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

NothingSessionSchema.index({ userId: 1, createdAt: -1 });

const MongooseNothingSession = mongoose.model<INothingSession>('NothingSession', NothingSessionSchema);

// Dual-mode proxy: Uses real Mongoose when connected, or MemoryStore if offline
export const NothingSession: any = new Proxy(MongooseNothingSession, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState === 1) {
      return Reflect.get(target, prop, receiver);
    }
    return (MemoryNothingSession as any)[prop] || Reflect.get(target, prop, receiver);
  },
});
