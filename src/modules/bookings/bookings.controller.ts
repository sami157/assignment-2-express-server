import { Request, Response } from 'express';
import { createBookingInDB, getAllBookingsFromDB, getBookingByIdFromDB, getBookingsByCustomerFromDB, updateBookingStatusInDB } from './bookings.service';
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
    const userId = req.user?.id;
    const role = req.user?.role;

    let bookings;

    if (role === "admin") {
      bookings = await getAllBookingsFromDB();
    } else {
      bookings = await getBookingsByCustomerFromDB(userId);
    }

    sendResponse(res,200,true,"Your bookings retrieved successfully","",bookings);
  } catch (error: any) {
    sendResponse(res, 500, false, "Failed to retrieve bookings", error.message, []);
  }
}



export async function updateBooking(req: Request, res: Response) {
  try {
    const bookingId = Number(req.params.bookingId);
    const userId = req.user?.id;
    const role = req.user?.role;
    const { status } = req.body;

    const booking = await getBookingByIdFromDB(bookingId);

    if (!booking) {
      return sendResponse(res, 404, false, "Booking not found", "", []);
    }

    if (role === "customer" && booking.customer_id !== userId) {
      return sendResponse(
        res,
        403,
        false,
        "Forbidden",
        "You cannot modify someone else's booking",
        []
      );
    }
    const updatedBooking = await updateBookingStatusInDB(bookingId, status);
    sendResponse(res, 200, true, "Booking updated successfully", "", updatedBooking);
  } catch (error: any) {
    sendResponse(res, 500, false, "Failed to update booking", error.message, []);
  }
}
