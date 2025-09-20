// What will follow if you register as a user?

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check of user already exits
  //check for image
  // check for avatar
  // upload them the cloudinary
  //create user object - create entry in db
  // remove password an refresh token field  from resposnse
  // check for user creation
  // return res

  const { email, username, fullName, password } = req.body;
  console.log({
   body: req.body,
   files: req.files.avatar[0]
  });

  if (
    [email, password, username, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, " All fields is required ");
  }

  const exitedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (exitedUser) {
    throw new ApiError(409, "username and email already exits");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImagePath = req.files?.coverImage[0]?.path;

  
   let coverImagePath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
       coverImagePath = req.files.coverImage[0].path
   }
  
  if (!avatarLocalPath) {
    throw new ApiError(400, " avatar files is required");
  }


  // if (!coverImagePath ) {
  //   throw new ApiError(400, "coverImage is required");
  // }


  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);
  if (!avatar) {
    throw new ApiError(400, " avatar  is required");
   }


  //  if (!coverImage) {
  //    throw new ApiError(400, "coverImage files is required ");
  // }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "user registered successfully"));
});

export { registerUser };
