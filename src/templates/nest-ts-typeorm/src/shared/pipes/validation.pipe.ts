import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ErrorExceptionWithResponse } from '../exceptions/error.exception';

/*------------------------------------------------------------------------- [ Custome Validation Pipe ] -------------------------------------------------------------------------*/

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        const errorMessage = errors
          .map((error) => Object.values(error.constraints).join(', '))
          .join(', ');

        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          errorMessage,
        );
      },
    });
  }
}
