import { pool } from '../../database/db';


export async function createVehicletoDB(data: Record<string, unknown>) {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = data;

    const result = await pool.query(
        `
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `,[
        vehicle_name, type, registration_number, daily_rent_price, availability_status,
    ]);

    return result.rows[0];
}

export async function getAllVehiclesfromDB() {
    const result = await pool.query('SELECT * FROM vehicles;');
    return result.rows;
}


export async function getSingleVehiclefromDB(id: number) {
    const result = await pool.query(
        `SELECT * FROM vehicles WHERE id = $1;`,
        [id]
    );
    return result.rows[0];
}

export async function deleteVehicleFromDB(id: number) {
    const result = await pool.query(
        `DELETE FROM vehicles WHERE id = $1 RETURNING id;`,
        [id]
    );

    return result.rows[0];
}

export async function updateVehicleInDB(id: number, data: Record<string, unknown>) {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = data;

    const result = await pool.query(
        `
        UPDATE vehicles
        SET 
            vehicle_name = $1,
            type = $2,
            registration_number = $3,
            daily_rent_price = $4,
            availability_status = $5
        WHERE id = $6
        RETURNING *;
        `,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
    );

    return result.rows[0];
}
