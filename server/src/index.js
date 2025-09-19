import dotenv from "dotenv"
import connectDB from './database/dB.js'
import express from 'express'
const app = express()
dotenv.config({
  path: './env'
})


connectDB()
.then(()=> {
  app.listen(process.env.PORT || 8000 , ()=>{
    console.log(`SERVER is running, ${process.env.PORT}`);
    
  }) 
})
.catch((error)=> {
  console.log("SERVER is failed");
  

})
