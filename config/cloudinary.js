const cloudinary = require("cloudinary").v2
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.API_SECRET,
  api_key:process.env.API_KEY
})


const uploadToCloud = async function (locaFilePath) {
  try {
    var mainFolderName = "public";
    var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;
    console.log(filePathOnCloudinary)

    const result = await cloudinary.uploader
      .upload(filePathOnCloudinary, {public_id:locaFilePath.split(".")[0],overwrite: true, unique_filename: true });
    fs.unlinkSync("public/" + locaFilePath);
    return {
      message: "Success",
      url: result.secure_url,
    };
  }catch(error) {
      // Remove file from local uploads folder
      return { message: "Upload Fail" };
    };
}

module.exports = uploadToCloud;