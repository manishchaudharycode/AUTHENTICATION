import { Router } from "express"
import {
  deleteVideo,
  getAllVideo,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo, // Fixed typo: upadateVideo -> updateVideo
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.js"

export const videoRouter = Router()

// Protect all routes
videoRouter.use(verifyJWT)

// List all videos
videoRouter.get("/", getAllVideo)


videoRouter.post(
  "/",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo,
)

// Get a video by id
videoRouter.get("/:videoId", getVideoById)

// Delete a video by id
videoRouter.delete("/:videoId", deleteVideo)

// Update a video's title/description and optional thumbnail
videoRouter.patch("/:videoId", upload.single("thumbnail"), updateVideo)

// Toggle publish status
videoRouter.patch("/toggle/publish/:videoId", togglePublishStatus)
