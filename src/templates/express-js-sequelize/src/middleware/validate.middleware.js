const { ErrorExceptionWithResponse } = require("../exception/error.exception");
const HttpStatus = require("http-status");

/*---------------------------------------------[ Validate Middleware ]----------------------------------------------*/
module.exports.validateMiddleware = (schema, property) => {
  return (err, req, res, next) => {
    try {
      const { error } = schema.validate(req[property]);
      if (error)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          error.details[0].message
        );
      next();
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message
      );
    }
  };
};
