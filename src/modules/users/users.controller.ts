import { Request, Response } from 'express';
import { getAllUsersFromDB } from './users.service';

import sendResponse from '../../config/sendResponse';

export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await getAllUsersFromDB();
        sendResponse(res, 200, true, 'Users retrieved successfully', '', users);
    } catch (error: any) {
        sendResponse(res, 500, false, 'Error retrieving users', error.message, []);
    }
}