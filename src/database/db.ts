import {Pool} from "pg"
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
export const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STRING}`
})

export const initDB = async() => {
    await pool.connect()
    console.log('DB Connected')
}
