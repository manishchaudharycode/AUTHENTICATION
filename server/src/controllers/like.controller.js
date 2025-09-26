import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id not found")
    }
  
    const existLike = await Like.findOne({video: videoId, user: req.user.id})
  if (existLike) {
      await existLike.deleteOne();
      return res.json(new ApiResponse(200,{like: false}, "video Unliked"))

  }

  const like = await Like.create({video: videoId, user: req.user.id})

  return res.status(200).json(new ApiResponse(200,{like: true} ,"video liked"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on commenti=
    if (!isValidObjectId(commentId)) {
     throw new ApiError(400, "comment id not Found ")   
    }

    const existLike = await Like.findOne({comment: commentId , user: req.user.id})
    
    if (existLike) {
        await existLike.deleteOne();
        return res.json(new ApiResponse(200,{like: false}, "comment unlike"))
    }

    const comment = await Like.create({comment: commentId, user: req.user.id})

    return res.status(200).json(new ApiResponse(200, {like: true}, "comment like"))


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Tweet id notr foun")
        
    }

    const existingLIke = await Like.findOne({tweet: tweetId, user:req.user.id})
    if (existingLIke) {
        await existingLIke.deleteOne();
        return res.json(new ApiResponse(200,{like: false},"tweet unlike"))
    }

    const tweet = await Like.create({tweet:tweetId, user:req.user.id})
    return res.status(200).json(new ApiResponse(200, {like: true}, "tweet like"))


}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {videoId} = req.params
        
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}