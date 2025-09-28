import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if (!name) {
        throw new ApiError(400, "playList name is required")
    }

    const playlist =await Playlist.create({
        name,
        description,
        owner: req.user.id,
        video: []
    })

    return res.status(200).json(new ApiResponse(200, "playlist created successfuly"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const playlist = await Playlist.find({owner: userId}).populate("videos")
    return res.status(200).json(new ApiResponse(200 , playlist, "user playlist fetch successfully "))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Playlist ID is not invalid")
    }

    const playLists = await Playlist.findById(playlistId).populate("videos").populate("owner", "username email")
    if (!playLists) {
        throw new ApiError(400, "playlist not found")
    }
    return res.status(200).json(new ApiResponse(200, "playlist fetch successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(videoId) || !isValidObjectId(playlistId)) {
        throw new ApiError(400 , "invalid playlist and videoId")
    }

    const   playList = await Playlist.findById(videoId)
    if (!playList) {
        throw new ApiError(400, "playlist is not found")
    }
   if (playList.vodeos.includes(videoId)) {
    throw new ApiError(400, "video alreadt in playlist")
   }
  playList.videos.push(videoId) 
  await playList.save()

  return res.status(200).json(new ApiResponse(200, "video added successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid playlist and videoId")
    }

    const playList = await Playlist.findById(playlistId)
    if (!playList) {
        throw new ApiError(400, "video id not found")
    }

    playList.videos = playList.videos.filter((id)=> id.toString() !==videoId.toString())
    await playList.save()

    return  res.status(200).json(new ApiResponse(200, "video remove from playlist"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!isValidObjectId) {
        throw new ApiError(400, "playlist id not found")
    }

    const playList = await Playlist.findById(playlistId)

    if (playList.owner.toString() !== req.user.id) {
        throw new ApiError(400, "you  are not  allowed to delete this playlist ")
    }
     await Playlist.deleteOne()

      return res.status(200).json(new ApiResponse(200, "playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400 , " Invalid playlist id")
    }

    const playList = await Playlist.findById(playlistId)

    if (!playList) {
        throw new ApiError(403, "playlist is nt found")
    }

    if(playList.owner.toString() !== req.user.id)
{
        throw new ApiError(402, "you are not allowed to update this playlist")
}
if(name) playList.name= name;
if(description) playList.description = description

await playList.save()

return res.status(200).json(new ApiResponse(200, "playlist update successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}