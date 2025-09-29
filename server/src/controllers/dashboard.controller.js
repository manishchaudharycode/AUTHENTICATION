import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.params;
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const stats = await Video.aggregate([
        {$match: {owner: new mongoose.Types.ObjectId(channelId)}},
        // lookup for likes
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "lokes"
            }
        },
        {
            $group: {
                _id:null,
                totalVideos: {$sum: 1},
                totalViews: { $sum:"$views" },
                totalLikes: {$sum: {$size: "$likes"}}
            }
        }
    ])

    const result = stats.length > 0 ? stats[0] : { totalVideos: 0, totalLikes: 0, totalViews: 0 };

     const totalSubscribers = await Subscription.countDocuments({channel: channelId})    

    return res.status(200).json(new ApiResponse(200, {
        totalVideos: result.totalVideos, totalSubscribers,
        totalLikes: result.totalLikes,
        totalViews: result.totalViews
    } ,"Channel stats fetch successfully"))
 


})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.user?.userId 
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "channel Id is required")
    }
    const videos = await Video.find({owner: channelId}).sort({createdAt: -1})
   return res.status(200).json(new ApiResponse(200, videos, {message: "channel video fetch successfully"}  ))

})

export {
    getChannelStats, 
    getChannelVideos
    }   