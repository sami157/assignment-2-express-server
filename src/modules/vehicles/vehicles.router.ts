import { Router } from 'express';
import { createVehicle, deleteVehicle, getAllVehicles, getSingleVehicle, updateVehicle } from './vehicles.controller';
import auth from '../../middleware/auth';

const router = Router();

router.post('/', auth("admin"), createVehicle);
router.get('/', getAllVehicles)
router.get('/:vehicleId', getSingleVehicle);
router.delete('/:vehicleId', auth("admin"), deleteVehicle);
router.put('/:vehicleId', auth("admin"), updateVehicle);


export const vehicleRouter = router;