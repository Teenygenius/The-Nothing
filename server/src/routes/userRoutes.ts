import { Router } from 'express';
import { getProfile, updateProfile, updatePassword, deleteAccount } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

export default router;
