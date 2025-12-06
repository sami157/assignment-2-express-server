import { Request, Response } from 'express';
import {createVehicletoDB} from './vehicles.service';
import sendResponse from '../../config/sendResponse';

export async function createVehicle(req: Request, res: Response) {
    try {
        const newVehicle = await createVehicletoDB(req.body);
        sendResponse(res, 201, true, "Vehicle created successfully",'',newVehicle)
    } catch (error: any) {
        sendResponse(res, 500, true, "Vehicle created successfully",error.message)
    }
}