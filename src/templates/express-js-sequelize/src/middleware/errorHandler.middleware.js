const HttpStatus = require("http-status");
const {
  CustomError,
  ErrorException,
  ErrorExceptionWithResponse,
} = require("../exception/error.exception");
const { constant } = require("../helper/constant");
const logger = require("../logger/logger");
const multer = require("multer");

/*---------------------------------------------[ Error Handler Middleware ]----------------------------------------------*/

module.exports.errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err instanceof multer.MulterError) {
    logger.error(`Handling Multer : ${err}`);
    return res.status(400).send(err.message);
  } else if (err instanceof ErrorException) {
    logger.error(`Handling errorException:${err}`);
    next();
  } else if (err instanceof ErrorExceptionWithResponse) {
    logger.error(`Handling ErrorExceptionWithResponse : ${err}`);
    return res.status(err.statusCode).send({
      statusCode: err.statusCode,
      error: err.error || true,
      message: err.message || constant.HANDLING_ERROR_EXCEPTION,
    });
  } else if (err instanceof CustomError) {
    logger.error(`Handling CustomError : ${err}`);
    return res.status(err.statusCode).send({
      statusCode: err.statusCode,
      error: err.error || true,
      message: err.message || constant.HANDLING_ERROR_EXCEPTION,
    });
  } else {
    logger.error(`Handling : ${err}`);
    return res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      error: true,
      message: err.message || constant.INTERNAL_SERVER_ERROR,
    });
  }
};
