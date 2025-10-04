import  { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import {ApiError} from "../utils/apiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideo = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const filter = {};

  if (query) {
    filter.title = { $regex: query, $options: "i" }; 
  }

  if (userId) {
    filter.user = userId; 
  }

  const sort = {};
  sort[sortBy] = sortType === "asc" ? 1 : -1;
  const total = await Video.countDocuments(filter);
  const videos = await Video.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    videos,
  });
});

export default getAllVideo;

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, videoUrl, streamUrl, duration, isPublished } = req.body;
  if (!title) {
    throw new ApiError(400, "Tilte is required");
  }
  const thumbnailPath = req.files?.thumbnail?.[0]?.path;
  
  const thumbnailUpload = await uploadOnCloudinary(thumbnailPath)
  console.log(thumbnailUpload);
  

  const video = await Video.create({
    title,
    description,
    videoUrl,
    streamUrl,
    duration,
    isPublished,
    views:0,
    thumbnail: thumbnailUpload.secure_url,
    user: req.user.id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  // TODO : get video by id
    const {videoId} = req.params
    if (!videoId || !isValidObjectId(videoId))  {
    throw new ApiError(400, "video ID not found")
    }

    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(400, "video not found")
    }

    return res.status(200).json(new ApiResponse(200, "video is upload successfully"))
});

const updateVideo = asyncHandler(async (req, res) => {
  // TODO :   update video details like title, description, thumbnail
  const { videoId } = req.params;   
  if (!videoId || !isValidObjectId(videoId))  {
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
  if (!videoId || !isValidObjectId(videoId))  {
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
  if (!videoId || !isValidObjectId(videoId)) {
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
  updateVideo,
  deleteVideo,
  togglePublishStatus,
}
