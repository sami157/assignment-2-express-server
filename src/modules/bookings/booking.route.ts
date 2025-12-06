import { Router } from 'express';
import { createBooking, getAllBookings, updateBooking } from './bookings.controller';
import auth from '../../middleware/auth';

const router = Router();

router.post('/', auth("admin", "customer"), createBooking);
router.get('/', auth("admin", "customer"), getAllBookings);
router.put('/:bookingId', auth("admin", "customer"), updateBooking);

export const bookingRouter = router;
