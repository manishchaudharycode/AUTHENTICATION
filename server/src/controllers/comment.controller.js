import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import Video from '../models/video.models'
import  Comment  from "../models/comment.models";
import { ApiResponse } from "../utils/apiResponse";

const getVideoComment = asyncHandler(async (req, res )=>{
  //TODO : get all comment video
  const{videoId} = req.params;
  const{page=1, limit=10}= req.query

  if(!videoId){
    throw new ApiError(407, "Video Id is required")
  }

  const videoExists =await Video.findById(videoId)
  if (!videoExists) {
    throw new ApiError(404, "video not found")
  }

 const pageNUmber =parseInt(page, 10) || 1;
 const pageSize = parseInt(limit, 10) || 10;
 
 const comments = await Comment.find({video: videoId}).sort({ createdAt: -1}).limit(pageSize).skip((pageNUmber - 1) * pageSize)

 const total = await Comment.countDocuments({video: videoId })  // Total comment count 

 return res.status(200).json( new ApiResponse(200,
    {comments, pagination:{
        total, 
        page: pageNUmber,
        limit: pageSize,
        totalPages:Math.ceil(total / pageSize)
    }},
    "Comment Fetched successfully"))
   

})


const addComment = asyncHandler( async(req, res)=> {
    //TODO :add a comment a video

    const {videoId} = req.params;   // URL - params
    const {content} = req.body;

    if (!videoId) {
        throw new ApiError(403, "Video ID is requried")
    }
    if (!content || content.trim()=== "") {
        throw new ApiError(400, "Content is required")
    }

        const videoExist = await Video.findById(videoId);
    if (!videoExist) {
        throw new ApiError(400, "Video not found")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    })
    
    return res.status(200).json( new ApiResponse(200,comment,"Comment added successfully"))

})

const updateComment = asyncHandler(async(req, res) => {
    // TODO : update a comment 
    const {commentId} = req.params;
   const {content} = req.body;
   if (!commentId) {
    throw new ApiError(402, "comment id is requried")
   }
   if (!content || content.trim()=== "") {
    throw new ApiError(400, "Content is required ")
   }

 const comment = await Comment.findById( commentId)
 if (!comment) {
    throw new ApiError(402, "Comment not found")
 }
 if (comment.owner.toString() !==req.user?._id.toString()) {
    throw new ApiError(400, "Not authorized to update this comment ")
 } 
 comment.content = content;
 await comment.save()  

 return res.status(200).json(new ApiResponse(201,comment,"Update comment successfully"))
})

const deleteComment = asyncHandler(async(req, res)=>{
// TODO : delete comment
const {commentId} = req.params

if (!commentId) {
    throw new ApiError(404, "comment ID not found")
}

const comment = await Comment.findById(commentId)
if (!comment) {
    throw new ApiError(400, "comment not found")
}

if (comment.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "Not authorized to delete this comment")
}

await comment.deleteOne()

return res.status(201).json( new ApiResponse(200, "comment deleted successfully"))

})



export {
    getVideoComment,
    addComment,
    updateComment,
    deleteComment
}