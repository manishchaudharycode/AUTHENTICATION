import mongoose from "mongoose";
import mongoos from "mongoose";




const likeSchema = new mongoos.Schema(
    {
        video : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
        comment : {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        },
        tweet : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tweet"
        }, 
        
            likedBy : {
                type: mongoos.Schema.Types.ObjectId,
                ref: "User"
            }
        
    },{timestamps: true}
)





export const Like = mongoos.model("Like", likeSchema)