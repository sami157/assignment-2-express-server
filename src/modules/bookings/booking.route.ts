import { Router } from 'express';
import { createBooking, getAllBookings, updateBooking } from './bookings.controller';

const router = Router();

router.post('/', createBooking);
router.get('/', getAllBookings);
router.put('/:bookingId', updateBooking);

export const bookingRouter = router;
