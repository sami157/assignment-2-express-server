import { Request, Response } from 'express';
import { deleteUserFromDB, getAllUsersFromDB, updateUserInDB } from './users.service';

import sendResponse from '../../config/sendResponse';

export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await getAllUsersFromDB();
        sendResponse(res, 200, true, 'Users retrieved successfully', '', users);
    } catch (error: any) {
        sendResponse(res, 500, false, 'Error retrieving users', error.message, []);
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const id = Number(req.params.userId);
        if (req.user?.role === "customer" && req.user.id !== id) {
      return sendResponse(res,403,false,"Forbidden","You can only update your own profile",[]);
    }
        const updatedUser = await updateUserInDB(id, req.body);

        if (!updatedUser) {
            return sendResponse(res, 404, false, 'User not found', '', []);
        }

        sendResponse(res, 200, true, 'User updated successfully', '', updatedUser);
    } catch (error: any) {
        sendResponse(res, 500, false, 'Failed to update user', error.message, []);
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const id = Number(req.params.userId);
        const deleted = await deleteUserFromDB(id);

        if (!deleted) {
            return sendResponse(res, 404, false, 'User not found', '', []);
        }
        sendResponse(res, 200, true, 'User deleted successfully', '', []);
    } catch (error: any) {
        sendResponse(res, 500, false, 'Failed to delete user', error.message, []);
    }
}