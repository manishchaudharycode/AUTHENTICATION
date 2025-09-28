import mongoose, {isValidObjectId} from "mongoose"
import { User } from "../models/user.models.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user?.Id
    // TODO: toggle subscription

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    if(channelId === String(userId)){
        throw new ApiError(400, "you can not subscribes channel")
    }

    const existSub = await Subscription.findOne({
        subscriber: userId,
        channel:channelId
    })
    if (existSub) {
     const deleteSUb = await Subscription.deleteOne();
      return res.status(200).json(ApiResponse(200, deleteSUb,"unsubscriber successfully"))
    } else {
        const newSub =await Subscription.create({
            subscriber: userId,
            channel: channelId
        })
       return res.status(200).json(new ApiResponse(200, newSub, "subscriber successfully")) 
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid cheannel")
    }
   const subscribers =  await Subscription.find({
        channel: channelId
    }).populate(
        "subscriber",
        "usename email avatar"
    )

    return res.status(200).json(new ApiResponse(200, subscribers, "subscriber fetch successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Inavalid subscriverId")
    }
    const subscriptions = await Subscription.find({subscriber: subscriberId}).populate("channel", "email username avatar ")

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}