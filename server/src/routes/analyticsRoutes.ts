import { Router } from 'express';
import { getDailyAnalytics, getWeeklyAnalytics, getMonthlyAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/daily', getDailyAnalytics);
router.get('/weekly', getWeeklyAnalytics);
router.get('/monthly', getMonthlyAnalytics);

export default router;
