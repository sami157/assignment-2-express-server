import express from "express"
import { initDB } from "./database/db"
import dotenv from 'dotenv'
import { vehicleRouter } from "./modules/vehicles/vehicles.router"
import { authRouter } from "./modules/auth/auth.route"
import { userRouter } from "./modules/users/users.routes"
dotenv.config({ path: '.env' })

const port = process.env.PORT
const app = express()
app.use(express.json())
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/vehicles', vehicleRouter)

initDB()

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})