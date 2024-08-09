import { diskStorage } from 'multer';

/*------------------------------------------------------------------------- [ Multer Config ] -------------------------------------------------------------------------*/

export const multerConfig = {
  dest: './uploads',
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(
        new Error('Image upload only supports PNG, JPG, and JPEG formats'),
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB limit
  },
};
