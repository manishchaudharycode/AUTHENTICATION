import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// router import

import useRouter from './routes/user.route.js'

// router declaration
app.use("/api/v1/users", useRouter)

app.get("/", async(req ,res)=>{
  res.json({
    message:
    "serveris heathy"
  })
})