import { Request, Response } from 'express';
import {createVehicletoDB, deleteVehicleFromDB, getAllVehiclesfromDB, getSingleVehiclefromDB, updateVehicleInDB, vehicleHasActiveBookings} from './vehicles.service';
import sendResponse from '../../config/sendResponse';


export async function createVehicle(req: Request, res: Response) {
    try {
        const newVehicle = await createVehicletoDB(req.body);
        sendResponse(res, 201, true, "Vehicle created successfully",'',newVehicle)
    } catch (error: any) {
        sendResponse(res, 500, false, "Failed to add new vehicle",error.message,[])
    }
}

export async function getAllVehicles(req: Request, res: Response) {
    try {
        const vehicles = await getAllVehiclesfromDB();
        sendResponse(res, 200, true, 'Here are all the vehicles', '', vehicles)
    } catch (error: any) {
        sendResponse(res, 500, false, "Error retrieving vehicle list", error.message, [])
    }
}

export async function getSingleVehicle(req: Request, res: Response) {
    try {
        const id = Number(req.params.vehicleId);
        const vehicle = await getSingleVehiclefromDB(id);

        if (!vehicle) {
            return sendResponse(res, 404, false, "Vehicle not found", '', []);
        }
        sendResponse(res, 200, true, "Vehicle details fetched successfully", '', vehicle);
    } catch (error: any) {
        sendResponse(res, 500, false, "Failed fetching vehicle", error.message, []);
    }
}

export async function deleteVehicle(req: Request, res: Response) {
    try {
        const vehicleId = Number(req.params.vehicleId);
        const hasActive = await vehicleHasActiveBookings(vehicleId);
        
        if (hasActive) {
            return sendResponse(res,400,false,"Cannot delete vehicle with active bookings","",[]);
        }

        const deleted = await deleteVehicleFromDB(vehicleId);
        if (!deleted) {
            return sendResponse(res, 404, false, "Vehicle not found", "", []);
        }

        sendResponse(res, 200, true, "Vehicle deleted successfully", "", []);
    } catch (error: any) {
        sendResponse(res, 500, false, "Failed to delete vehicle", error.message, []);
    }
}


export async function updateVehicle(req: Request, res: Response) {
    try {
        const id = Number(req.params.vehicleId);
        const updatedVehicle = await updateVehicleInDB(id, req.body);

        if (!updatedVehicle) {
            return sendResponse(res, 404, false, "Vehicle not found", '', []);
        }

        sendResponse(res, 200, true, "Vehicle updated successfully", '', updatedVehicle);
    } catch (error: any) {
        sendResponse(res, 500, false, "Failed to update vehicle", error.message, []);
    }
}
