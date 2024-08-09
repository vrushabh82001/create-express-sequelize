import { HttpStatus } from '@nestjs/common';

/*------------------------------------------------------------------------- [ Error Exception ] -------------------------------------------------------------------------*/

export class ErrorException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Error.captureStackTrace(this, this.constructor);
  }
}

/*------------------------------------------------------------------------- [ Error With Response Exception ] -------------------------------------------------------------------------*/

export class ErrorExceptionWithResponse extends Error {
  public error: boolean;
  public statusCode: number;

  constructor(statusCode: number, error: boolean, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.error = error;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/*------------------------------------------------------------------------- [ Custome Error Exception ] -------------------------------------------------------------------------*/

export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    Error.captureStackTrace(this, this.constructor);
  }
}
