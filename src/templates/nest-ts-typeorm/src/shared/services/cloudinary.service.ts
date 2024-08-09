import { Injectable, HttpStatus } from '@nestjs/common';
import { ErrorExceptionWithResponse } from '../exceptions/error.exception';
import { writeFileAsync, deleteFile } from '../utils/common.utils';
import { ConfigService } from '@nestjs/config';
import { cloudinaryConfig } from '../../config/cloudinary.config';

/*------------------------------------------------------------------------- [ Cloudinary Service ] -------------------------------------------------------------------------*/

@Injectable()
export class CloudinaryService {
  private cloudinary;

  constructor(private readonly configService: ConfigService) {
    this.initCloudinary();
  }

  private async initCloudinary() {
    this.cloudinary = await cloudinaryConfig(this.configService);
  }

  /*------------------------------------------------------------------------- [ Upload Image On Cloud ] -------------------------------------------------------------------------*/

  async uploadImage(file: any, folder: string) {
    try {
      const result = await this.cloudinary.uploader.upload(file.path, {
        folder,
        transformation: [],
      });
      return result;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw new ErrorExceptionWithResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    } finally {
      await deleteFile(file.path);
    }
  }

  /*------------------------------------------------------------------------- [ Upload Buffer Image On Cloud ] -------------------------------------------------------------------------*/

  async uploadImageBuffer(image: any, folder: string) {
    const tempFilePath = `temp_image_${Date.now()}.png`;

    try {
      await writeFileAsync(image.buffer, tempFilePath);

      const result = await this.cloudinary.uploader.upload(tempFilePath, {
        folder,
        transformation: [],
      });
      return result;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw new ErrorExceptionWithResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    } finally {
      await deleteFile(tempFilePath);
    }
  }
}
