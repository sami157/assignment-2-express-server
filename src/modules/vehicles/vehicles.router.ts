import { Router } from 'express';
import { createVehicle, deleteVehicle, getAllVehicles, getSingleVehicle, updateVehicle } from './vehicles.controller';

const router = Router();

router.post('/', createVehicle);
router.get('/', getAllVehicles)
router.get('/:vehicleId', getSingleVehicle);
router.delete('/:vehicleId', deleteVehicle);
router.put('/:vehicleId', updateVehicle);


export const vehicleRouter = router;