// What will follow if you register as a user?

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

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
    files: req.files,
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

  let coverImagePath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagePath = req.files.coverImage[0].path;
  }

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, " avatar files is required");
  }
  if (!coverImagePath) {
    throw new ApiError(400, "coverImage is required");
  }

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

const loginUser = asyncHandler(async (req, res) => {
  // req body - data
  // username or email
  //find the user
  // check the password
  //access and refresh Token
  // send the cookie

  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "username or. email field is required");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "user is not exits");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user is credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  User.findById(user._id).select("-password -refreshToken");

  // use of cookie
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loginUser,
          accessToken,
          refreshToken,
        },
        "user logged In Successfully"
      )
    );
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somethin went wrong while generating refresh and access token"
    );
  }
};

const logoutUser = asyncHandler(async (req, res) => {
  console.log("DSF/fwa", req.user._id);

  await User.findByIdAndUpdate(req.user._id, {
    refreshToken: "",
  });

  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const inComingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!inComingRefreshToken) {
    throw new ApiError(400, "unautorized request");
  }
  try {
    const decodedToken = jwt.verify(
      inComingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(400, "Invalid refresh token ");
    }
    if (inComingRefreshToken !== User?.refreshToken) {
      throw new ApiError(4001, "Refresh Token is Expiry to used ");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
         new  ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "access token is refrished"
        )
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "Invalid refresh token  ");
  }
});

const changeCrrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, currentPassword } = req.body;

  const user = await User.findById(req.user?.id);
  const isPasswordCorrect = user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "unvalid old password");

    user.password = newPassword;
    const s = await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "password change successfully"));
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse( req.user, "current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res)=> {
    const {email, fullName }  = req.body
    if (!email  || !fullName) {
      throw new ApiError(400, "All fiedls are required ")
    }
  const user = await  User.findById(req.user._id ,{
    fullName,
    email
  }, {
    new: true
  })  
  return res.status(200).json(new ApiResponse(user, "Account updated"))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path
  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage is Missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if (!coverImage.url) {
    throw new ApiError(400, "Error is covarImage ")
  }
 const user =await User.findByIdAndUpdate(req.user._id, 
  {
    coverImage:coverImage.url
  },{new:true}) 

  return res.status(200).json(new ApiResponse(user, "coverImage uploading successfully"))
});

//import { v2 as cloudinary } from "cloudinary";

const avatarUserUpate = asyncHandler(async(req, res)=>{
 const avatarLocalPath = req.file?.path
 if (!avatarLocalPath) {
  throw new ApiError(400, "Avatar is missing")
 }
const deleteAvatar = await User.findByIdAndDelete(req.user._id)
if (!deleteAvatar) {
 throw new ApiError(400, "Old Avatar not deleted")  
}


const avatar =await uploadOnCloudinary(avatarLocalPath)

if (!avatar.url) {
  throw new ApiError(400, "Error is uploading avatar")
}
const user = await User.findByIdAndUpdate(req.user._id, 
  {
    avatar:avatar.url
  },
  {new: true})
  
  //await cloudinary.uploader.destroy(user.avatar.split("/"[-1]))

  return res.status(200).json(new ApiResponse(user, "avatar image uploaded successfully"))
  
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCrrentPassword,
  updateUserCoverImage,
  getCurrentUser,
  updateAccountDetails,
  avatarUserUpate

};
