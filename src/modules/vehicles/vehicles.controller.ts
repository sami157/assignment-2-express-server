import { Request, Response } from 'express';
import {createVehicletoDB, getAllVehiclesfromDB} from './vehicles.service';
import sendResponse from '../../config/sendResponse';

export async function getAllVehicles(req: Request, res: Response) {
    try {
        const vehicles = await getAllVehiclesfromDB();
        sendResponse(res, 200, true, 'Here are all the vehicles', '', vehicles)
    } catch (error: any) {
        sendResponse(res, 500, false, "Error retrieving vehicle list", error.message, [])
    }
}

export async function createVehicle(req: Request, res: Response) {
    try {
        const newVehicle = await createVehicletoDB(req.body);
        sendResponse(res, 201, true, "Vehicle created successfully",'',newVehicle)
    } catch (error: any) {
        sendResponse(res, 500, false, "Failed to add new vehicle",error.message,[])
    }
}