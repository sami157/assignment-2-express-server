import { Request, Response } from 'express';
import { autoReturnExpiredBookings, createBookingInDB, getAllBookingsFromDB, getBookingByIdFromDB, getBookingsByCustomerFromDB, updateBookingStatusInDB } from './bookings.service';
import sendResponse from '../../config/sendResponse';
import { getUserById, getVehicleById } from '../../utils/getInfo';

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

    await autoReturnExpiredBookings();
    let bookings;

    if (role === "admin") {
      bookings = await getAllBookingsFromDB();

      const formattedBookings = await Promise.all(bookings.map(async (booking: any) => {
        const customer = await getUserById(booking.customer_id);
        const vehicle = await getVehicleById(booking.vehicle_id);

        return {
          id: booking.id,
          customer_id: booking.customer_id,
          vehicle_id: booking.vehicle_id,
          rent_start_date: booking.rent_start_date,
          rent_end_date: booking.rent_end_date,
          total_price: booking.total_price,
          status: booking.status,
          customer: {
            name: customer?.name,
            email: customer?.email,
          },
          vehicle: {
            vehicle_name: vehicle.vehicle_name,
            registration_number: vehicle.registration_number,
          },
        };
      }));

      sendResponse(res, 200, true, "Bookings retrieved successfully", "", formattedBookings);
    } else {
      bookings = await getBookingsByCustomerFromDB(userId);

      const formattedBookings = await Promise.all(bookings.map(async (booking: any) => {
        const vehicle = await getVehicleById(booking.vehicle_id);
        return {
          id: booking.id,
          vehicle_id: booking.vehicle_id,
          rent_start_date: booking.rent_start_date,
          rent_end_date: booking.rent_end_date,
          total_price: booking.total_price,
          status: booking.status,
          vehicle: {
            vehicle_name: vehicle.vehicle_name,
            registration_number: vehicle.registration_number,
            type: vehicle.type,
          },
        };
      }));

      sendResponse(res, 200, true, "Your bookings retrieved successfully", "", formattedBookings);
    }
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

    await autoReturnExpiredBookings();
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
