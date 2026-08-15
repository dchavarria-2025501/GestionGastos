import { Router } from 'express';
import { listUsers, updateUser, deleteUser } from '../controllers/user.controller';
import { authGuard } from '../middleware/auth.middleware';
import { roleGuard } from '../middleware/role.middleware';

const router = Router();

router.get('/', authGuard, roleGuard('admin'), listUsers);
router.put('/:id', authGuard, roleGuard('admin'), updateUser);
router.delete('/:id', authGuard, roleGuard('admin'), deleteUser);

export default router;
