import { Router } from 'express';
import { getAllUsers } from './users.controller';

const router = Router();

router.get('/', getAllUsers);

export const userRouter = router;
