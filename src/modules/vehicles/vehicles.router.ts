import { Router } from 'express';
import { createVehicle, deleteVehicle, getAllVehicles, getSingleVehicle } from './vehicles.controller';

const router = Router();

router.post('/', createVehicle);
router.get('/', getAllVehicles)
router.get('/:vehicleId', getSingleVehicle);
router.delete('/:vehicleId', deleteVehicle);


export const vehicleRouter = router;