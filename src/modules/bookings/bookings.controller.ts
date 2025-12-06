import { Request, Response } from 'express';
import { createBookingInDB } from './bookings.service';
import sendResponse from '../../config/sendResponse';

export async function createBooking(req: Request, res: Response) {
    try {
        const booking = await createBookingInDB(req.body);
        sendResponse(res, 201, true, 'Booking created successfully', '', booking);
    } catch (error: any) {
        sendResponse(res, 500, false, 'Failed to create booking', error.message, []);
    }
}