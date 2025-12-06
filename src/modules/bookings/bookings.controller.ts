import { Request, Response } from 'express';
import { createBookingInDB, getAllBookingsFromDB, updateBookingStatusInDB } from './bookings.service';
import sendResponse from '../../config/sendResponse';

export async function createBooking(req: Request, res: Response) {
    try {
        const booking = await createBookingInDB(req.body);
        sendResponse(res, 201, true, 'Booking created successfully', '', booking);
    } catch (error: any) {
        sendResponse(res, 500, false, 'Failed to create booking', error.message, []);
    }
}

export async function getAllBookings(req: Request, res: Response) {
    try {
        const bookings = await getAllBookingsFromDB();
        sendResponse(res, 200, true, 'Bookings retrieved successfully', '', bookings);
    } catch (error: any) {
        sendResponse(res, 500, false, 'Failed to retrieve bookings', error.message, []);
    }
}


export async function updateBooking(req: Request, res: Response) {
    try {
        const id = Number(req.params.bookingId);
        const { status } = req.body;

        const updated = await updateBookingStatusInDB(id, status);

        if (!updated) {
            return sendResponse(res, 404, false, 'Booking not found', '', []);
        }

        if (status === 'returned') {
            return sendResponse(res, 200, true, 'Booking marked as returned. Vehicle is now available', '', updated);
        }

        if (status === 'cancelled') {
            return sendResponse(res,200,true,'Booking cancelled successfully','',updated);
        }

        return sendResponse(res, 400, false, 'Invalid status', '', []);

    } catch (error: any) {
        sendResponse(res, 500, false, 'Failed to update booking', error.message, []);
    }
}