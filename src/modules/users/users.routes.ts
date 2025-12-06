import { Router } from 'express';
import { deleteUser, getAllUsers, updateUser } from './users.controller';

const router = Router();

router.get('/', getAllUsers);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export const userRouter = router;
