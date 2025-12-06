import { Router } from 'express';
import { createBooking } from './bookings.controller';

const router = Router();

router.post('/', createBooking);

export const bookingRouter = router;
