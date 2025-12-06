import { Router } from 'express';
import { createVehicle } from './vehicles.controller';

const router = Router();

router.post('/', createVehicle);

export const vehicleRouter = router;