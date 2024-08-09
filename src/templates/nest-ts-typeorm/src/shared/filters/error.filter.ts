import { Catch, ArgumentsHost, HttpStatus, Inject } from '@nestjs/common';
import { ExceptionFilter, BadRequestException } from '@nestjs/common';
import { LoggerService } from '../../shared/services/logger.service';
import {
  ErrorException,
  ErrorExceptionWithResponse,
  CustomError,
} from '../exceptions/error.exception';
import { constant } from '../../shared/helpers/constant';

/*------------------------------------------------------------------------- [ Error Exception Filter ] -------------------------------------------------------------------------*/

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}

  catch(err: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (err instanceof ErrorException) {
      this.logger.error(`Handling errorException: ${err}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: true,
        message: err.message || constant.INTERNAL_SERVER_ERROR,
      });
    } else if (err instanceof ErrorExceptionWithResponse) {
      this.logger.error(`Handling ErrorExceptionWithResponse : ${err}`);
      return response.status(err.statusCode).json({
        statusCode: err.statusCode,
        error: err.error || true,
        message: err.message || constant.HANDLING_ERROR_EXCEPTION,
      });
    } else if (err instanceof CustomError) {
      this.logger.error(`Handling CustomError : ${err}`);
      return response.status(err.statusCode).json({
        statusCode: err.statusCode,
        error: true,
        message: err.message || constant.HANDLING_ERROR_EXCEPTION,
      });
    } else if (err instanceof BadRequestException) {
      this.logger.error(`Handling BadRequestException : ${err.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: true,
        message: err.message || 'Bad Request',
      });
    } else {
      this.logger.error(`Handling : ${err}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: true,
        message: err.message || constant.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
