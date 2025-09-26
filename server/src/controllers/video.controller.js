import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideo = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, Query, sortBy, sortType, userId } = req.Query;
  // TODO : get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO : get video, upload to cloudinary , create video
  const { title, description } = re.body;
  if (!title) {
    throw new ApiError(400, "Tilte is required");
  }
  if (!req.files?.videoFile) {
    throw new ApiError(400, "Video file is required");
  }

  const videoPath = req.files?.videoFile[0].path;
  const thumbnailPath = req.files?.thumbnail?.[0]?.path;

  const videoUpload = await uploadOnCloudinary(videoPath, {
    resource_type: "video",
  });
  if (!videoUpload) {
    throw new ApiError(400, " video not uploaded ");
  }

  const thumbnailUpload = thumbnailPath
    ? await uploadOnCloudinary(thumbnailPath)
    : null;

  const video = await Video.create({
    title,
    description,
    videoUrl: videoUpload.secure_url,
    videoPublicId: videoUpload.public_id,
    thumbnailUrl: thumbnailUpload.secure_url,
    thumbnailPublicId: thumbnailUpload.public_id,
    user: req.user.id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  // TODO : get video by id
    const {videoId} = req.params
    if (!videoId) {
    throw new ApiError(400, "video ID not found")
    }

    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(400, "video not found")
    }

    return res.status(200).json(new ApiResponse(200, "video is upload successfully"))
});

const upadateVideo = asyncHandler(async (req, res) => {
  // TODO :   update video details like title, description, thumbnail
  const { videoId } = req.params;   
  if (!videoId) {
    throw new ApiError(400, "Video ID not found")
  }
   const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400,"video not found")
    }

    if (String(Video.user) !== String(req.user.id)) {
        throw new ApiError(400,"NOT found owner")
    }
    const{title, description} = req.body;
    if (title !== undefined) video.title = title;
    if(description !== undefined) video.description = description

    const thumbnail =req.file.path;
    if (!thumbnail ) {
        throw new ApiError(400, "thumbnail not found")
    }
    const thumbnailUpload = await uploadOnCloudinary(thumbnail)
    video.thumbnailUrl = thumbnailUpload.secure_url;
    video.thumbnailPublicId = thumbnailUpload.public_id

    await video.save();
    return res.status(200).json(new ApiResponse(200, "video updated successfully"))


});

const deleteVideo = asyncHandler(async (req, res) => {
  // TODO : delete video
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "video ID not found")
  }

  const video = await Video.findById(videoId)
  if (!video) {
    throw new ApiError(400, " video not found")
  }

  if (String(Video.user) !== String(req.user.id)) {
    throw new ApiError(400, "Not found owner")
  }

  await Video.deleteOne()
return res.status(200).json(new ApiResponse(200, "video deleted success"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video ID not found")
  }

  const video = await Video.findById(videoId)
  if (!video) {
    throw new ApiError(400, "Video is not found")
  }

  if (String(video.user) !== String(req.user.id)) {
    throw new ApiError(403, "not is owner")
  }

  video.published = !Video.published;
  await video.save();

  return res.status(200).json(new ApiResponse(200,{published: video.published} ,"video successfully"))  

});

export {
  getAllVideo,
  publishAVideo,
  getVideoById,
  upadateVideo,
  deleteVideo,
  togglePublishStatus,
}
