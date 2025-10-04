import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { upload } from "./middlewares/multer.js";

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
import { videoRouter } from "./routes/video.route.js";

// router declaration
app.use("/api/v1/users", useRouter)
app.use("/api/v1/video",videoRouter)

app.get("/", async(req ,res)=>{
  res.json({
    message:
    "serveris heathy"
  })
})


