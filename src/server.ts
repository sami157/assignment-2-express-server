import express from "express"
import { initDB } from "./database/db"
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const port = process.env.PORT
const app = express()
app.use(express.json())

initDB()

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})