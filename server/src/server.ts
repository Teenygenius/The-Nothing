import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import nothingRoutes from './routes/nothingRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'System is running smoothly doing absolutely nothing.',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/nothing', nothingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling
app.use(errorHandler);

// Start server after DB connection
const startServer = async () => {
  try {
    console.log('[NOTHING] Initializing enterprise void architecture...');
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[NOTHING] Enterprise backend running at: http://localhost:${PORT}`);
      console.log(`[NOTHING] Total productivity expected: 0%`);
    });
  } catch (error) {
    console.error('[NOTHING] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
