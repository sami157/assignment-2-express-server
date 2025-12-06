import { pool } from "../../database/db";

export async function getAllUsersFromDB() {
    const result = await pool.query(
        `SELECT id, name, email, phone, role FROM users;`
    );
    return result.rows;
}

export async function updateUserInDB(id: number, data: Record<string, unknown>) {
    const { name, email, phone, role } = data;

    const result = await pool.query(
        `
        UPDATE users
        SET 
            name = $1,
            email = $2,
            phone = $3,
            role = $4
        WHERE id = $5
        RETURNING id, name, email, phone, role;
        `,
        [name, email, phone, role, id]
    );

    return result.rows[0];
}

export async function deleteUserFromDB(id: number) {
    const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING id;`,
        [id]
    );

    return result.rows[0];
}

export async function userHasActiveBookings(userId: number) {
    const result = await pool.query(
        `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
        [userId]
    );
    return result.rows.length > 0;
}
