class ErrorException extends Error {
  constructor(message) {
    super(message, 400);
  }
}

class ErrorExceptionWithResponse extends Error {
  constructor(statusCode, error, message) {
    super(message, statusCode);
    this.error = error;
    this.statusCode = statusCode;
  }
}

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  CustomError,
  ErrorException,
  ErrorExceptionWithResponse,
};
