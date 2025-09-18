import dotenv from "dotenv"
import connectDB from './database/dB.js'

dotenv.config({
  path: './env'
})


connectDB()

// find the error