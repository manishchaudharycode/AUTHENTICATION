import Router from "express"
import verifyJWT from "../middlewares/auth.middleware"
import { deleteVideo, getAllVideo, getVideoById, publishAVideo, togglePublishStatus, upadateVideo } from "../controllers/video.controller";
import { upload } from "../middlewares/multer";


const router = Router();
router.use(verifyJWT)

router.route("/").get(getAllVideo)
router.route("/").post(
    upload.fields([
        {
            name: "videofile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1,
        }
    ]),
    publishAVideo
);
router.route("/:videoId").get(getVideoById);
router.route("/:videoId").delete(deleteVideo);
router.route("/:videoId").patch(upload.single("thumbnail"), upadateVideo);
router.route("toggle/publish/:videoId").patch(togglePublishStatus)