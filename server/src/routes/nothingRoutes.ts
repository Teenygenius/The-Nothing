import { Router } from 'express';
import { startSession, stopSession, getSessions, getStats } from '../controllers/nothingController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/start', startSession);
router.post('/stop', stopSession);
router.get('/sessions', getSessions);
router.get('/stats', getStats);

export default router;
