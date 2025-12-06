import { Request, Response } from 'express';
import { loginUserFromDB, registerUserInDB } from './auth.service';
import sendResponse from '../../config/sendResponse';

export async function signup(req: Request, res: Response) {
    try {
        const user = await registerUserInDB(req.body);
        sendResponse(res, 201, true, 'User registered successfully', '', user);
    } catch (error: any) {
        sendResponse(res, 500, false, 'Failed to register user', error.message, []);
    }
}

export async function signin(req: Request, res: Response) {
    try {
        const result = await loginUserFromDB(req.body);
        sendResponse(res, 200, true, 'Login successful', '', result);
    } catch (error: any) {
        sendResponse(res, 401, false, 'Login failed', error.message, []);
    }
}