import { pool } from "../database/db";

export async function getUserById(userId: number) {
  const result = await pool.query('SELECT name, email FROM users WHERE id = $1', [userId]);
  console.log(userId)
  return result.rows[0];
}


export async function getVehicleById(vehicleId: number) {
  const result = await pool.query('SELECT vehicle_name, registration_number, type FROM vehicles WHERE id = $1', [vehicleId]);
  return result.rows[0];
}
