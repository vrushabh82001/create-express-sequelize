const HttpStatus = require("http-status");
const { ErrorExceptionWithResponse } = require("../exception/error.exception");
const { writeFileAsync, deleteFile } = require("../utils/common.utils");
const cloudinary = require("cloudinary").v2;
const path = require("path");

module.exports = class CloudinaryService {
  constructor() {
    this.cloudinary = cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  //------------------------------------------------  [ noremal upload file on cloude  ] ------------------------------------------------

  async uploadImage(file, folder) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        transformation: [],
      });
      return result;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw new ErrorExceptionWithResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message
      );
    } finally {
      await deleteFile(file.path);
    }
  }

  //------------------------------------------------  [ Buffer file on cloude  ] ------------------------------------------------

  async uploadImageBuffer(image, folder) {
    // Create a temporary file path
    const tempFilePath = path.join(__dirname, `temp_image_${Date.now()}.png`);

    try {
      // Write the buffer to the temporary file
      await writeFileAsync(image.buffer, tempFilePath);

      // Upload the temporary file to Cloudinary
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: folder,
        transformation: [],
      });
      return result;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw error;
    } finally {
      await deleteFile(tempFilePath);
    }
  }
};
