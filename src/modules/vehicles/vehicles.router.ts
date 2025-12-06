import { Router } from 'express';
import { createVehicle, getAllVehicles } from './vehicles.controller';

const router = Router();

router.get('/', getAllVehicles)
router.post('/', createVehicle);


export const vehicleRouter = router;