const multer = require("multer");

module.exports = class MulterService {
  constructor() {
    this.storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/"); // Destination folder for uploaded files
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
      },
    });
    this.fileFilter = (req, file, cb) => {
      if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
        return cb(new Error("image upload only png - jpg - jpeg"));
      }
      cb(undefined, true);
    };

    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    });
  }

  //------------------------------------------------  [ single upload  ] ------------------------------------------------
  singleUpload(fieldName) {
    return this.upload.single(fieldName);
  }

  //------------------------------------------------  [ multiple upload  ] ------------------------------------------------
  multipleUpload(fieldName, maxCount) {
    return this.upload.array(fieldName, maxCount);
  }

  //------------------------------------------------  [ fields upload  ] ------------------------------------------------
  fieldsUpload(fieldsArray) {
    return this.upload.fields(fieldsArray);
  }

  //------------------------------------------------  [ validation file type  ] ------------------------------------------------
  validateFileType(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("image upload only png - jpg - jpeg"));
    }
    cb(null, true);
  }
};
