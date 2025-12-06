import { Router } from 'express';
import { deleteUser, getAllUsers, updateUser } from './users.controller';
import auth from '../../middleware/auth';

const router = Router();

router.get('/', auth('admin'), getAllUsers);
router.put('/:userId', auth('admin', 'customer') ,updateUser);
router.delete('/:userId', auth('admin'), deleteUser);

export const userRouter = router;
