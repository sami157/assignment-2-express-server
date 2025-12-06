import express from "express"
import { initDB } from "./database/db"
import dotenv from 'dotenv'
import { vehicleRouter } from "./modules/vehicles/vehicles.router"
dotenv.config({ path: '.env' })

const port = process.env.PORT
const app = express()
app.use(express.json())
app.use('/api/v1/vehicles', vehicleRouter)

initDB()

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})