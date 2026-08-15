import { Router } from 'express';
import { register, login, profile } from '../controllers/auth.controller';
import { authGuard } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authGuard, profile);

export default router;
