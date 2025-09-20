import { ApiError } from "../utils/apiError"
import { asyncHandler } from "../utils/asyncHandler"
import { JWT } from "jsonwebtoken"
import { User } from "../models/user.models"

export const verifyJWT = asyncHandler(async(req, res, next)=>{
    try {
        const token =   req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decoidedToken = JWT.verifyJWT(token, process.env.ACCESS_TOKEN_SECRET)
         const user = await  User.findById(decoidedToken?._id).select(-password -refreshToken )
         if (!user) {
            //
       throw new ApiError(401, "invalid access token ")        
    }
    
         req.user = user;
         next(  )
    } catch (error) {
    throw new ApiError(402, error?.message || "Invalid access Token")
        
    }
})