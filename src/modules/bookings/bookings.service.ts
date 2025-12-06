import { pool } from '../../database/db';
import { calculateTotalPrice } from '../../utils/calculatePrice';

export async function createBookingInDB(data: Record<string, unknown>) {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;

    const vehicleRes = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicle_id]);
    const vehicle = vehicleRes.rows[0];

    if (!vehicle) {
        throw new Error('Vehicle not found');
    }

    if (vehicle.availability_status !== 'available') {
        throw new Error('Vehicle is not available');
    }

    const total_price = calculateTotalPrice(
        rent_start_date as string,
        rent_end_date as string,
        vehicle.daily_rent_price
    );

    const bookingRes = await pool.query(
        `
        INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
        VALUES ($1, $2, $3, $4, $5, 'active')
        RETURNING *;
        `, 
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    const booking = bookingRes.rows[0];

    await pool.query(`UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`, [vehicle_id]);

    return {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    };
}
