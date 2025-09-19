import { asyncHandler} from '../utils/asyncHandler.js'

export const registerUser = asyncHandler(async ()=>{
     res.status(200).json({
        message:
        "ok"
     })
})