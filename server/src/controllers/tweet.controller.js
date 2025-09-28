import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
   const userId = req.user?.userId
   const {content} = req.body
   if (!isValidObjectId(userId)) {
     throw new ApiError(400, "Invalid UserId")
   }
     
   if (!content || content.trim() === "") {
    throw new ApiError(400, "Tweet content is required  ")
   }

   const tweet = await Tweet.create({
    content,
    owner: userId
   })

   return res.status(200).json(new ApiResponse(200, tweet, "Tweet Create successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.user?.userId
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const tweets = await Tweet.find({owner: userId}).sort({createdAt: -1})

    return res.status(200).json(new ApiResponse(400, "user tweet created successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const userId = req.user?.userId;
    const {content} =req.body;
    const {tweetId} = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "TweetId is required")
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Updated content is required")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(400, "Tweet not found")
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(400, "you are not Updated tweet")
    }

    tweet.content = content
    const updateTweet = await Tweet.save();

    return res.status(200).json(new ApiResponse(200, updateTweet, "tweet updated successsfully"))


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const userId = req.user?.userId
    const {tweetId} = req.params;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "tweet ID is required")
    } 

    const tweet = await Tweet.findById(tweetId)
    
    if (!tweet ) {
        throw new ApiError(400, "tweet is required")
    }
    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(400, "you are not delete found tweet")
    }

    const deleteTweet = await Tweet.deleteOne()

   return res.status(200).json(new ApiResponse(200, deleteTweet, "Tweet delete successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}