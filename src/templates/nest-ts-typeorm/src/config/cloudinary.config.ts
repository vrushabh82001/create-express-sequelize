// cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

/*------------------------------------------------------------------------- [ Cloudinary Config ] -------------------------------------------------------------------------*/

export const cloudinaryConfig = async (configService: ConfigService) => {
  cloudinary.config({
    cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
  });
  return cloudinary;
};
