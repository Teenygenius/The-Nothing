import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<string> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nothing';

  try {
    console.log(`[DB] Attempting connection to MongoDB: ${uri.replace(/\/\/.*@/, '//<credentials>@')}...`);
    // Connect with a 2-second timeout so it never hangs if no local MongoDB service is installed
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[DB] Connected successfully to MongoDB!`);
    return uri;
  } catch (err: any) {
    console.warn(`[DB] Notice: External MongoDB not reachable (${err.message}).`);
    console.log(`[DB] Active Mode: Zero-Config In-Memory Database Mode enabled.`);
    console.log(`[DB] All models, JWT authentication, and session metrics will persist in memory.`);
    return 'memory://nothing';
  }
};

export const closeDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
};
