import { pool } from "../../database/db";

export async function getAllUsersFromDB() {
    const result = await pool.query(
        `SELECT id, name, email, phone, role FROM users;`
    );
    return result.rows;
}