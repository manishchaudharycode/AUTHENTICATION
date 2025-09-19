import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: "process.env.CLOUDINARY_CLOUD_NAME",
  api_key: "process.env.CLOUDINARY_API_KEY",
  api_secret: "process.env.CLOUDINARY_API_SECRET    ",
});

export const uploadOnCloudinary = async (localiFilePath) => {
  try {
    if (!localiFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localiFilePath, {
      resource_type: "auto",
    });
    // file has been succesfully
    console.log("file is uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localiFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

cloudinary.uploader
  .upload("my_image.jpg")
  .then((result) => console.log(result));
