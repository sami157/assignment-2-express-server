import { Pool } from "pg"
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
export const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STRING}`
})

export const initDB = async () => {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL CHECK(char_length(password) >= 6),
            phone TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN('admin', 'customer'))
        )`
    )

    await pool.query(
        `CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name TEXT NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
            registration_number TEXT NOT NULL UNIQUE,
            daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
            availability_status TEXT NOT NULL CHECK (availability_status IN ('available', 'booked'))
        )`
    )
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
            total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
            status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
        );
`);

}
