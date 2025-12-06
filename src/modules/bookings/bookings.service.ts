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

export async function getAllBookingsFromDB() {
    const result = await pool.query(`
        SELECT 
            b.id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            v.vehicle_name,
            v.registration_number,
            v.type
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
    `);


    const resultResponse = result.rows.map(row => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.registration_number,
            type: row.type
        }
    }));

    return resultResponse;
}


export async function updateBookingStatusInDB(id: number, status: string) {
    const bookingRes = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [id]
    );

    const booking = bookingRes.rows[0];
    if (!booking) return null;

    if (status === 'returned') {
        await pool.query(
            `UPDATE bookings SET status = 'returned' WHERE id = $1`,
            [id]
        );

        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );

        return {
            ...booking,
            status: 'returned',
            vehicle: {
                availability_status: 'available'
            }
        };
    }

    if (status === 'cancelled') {
        await pool.query(
            `UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
            [id]
        );

        return {
            ...booking,
            status: 'cancelled'
        };
    }

    return null;
}
