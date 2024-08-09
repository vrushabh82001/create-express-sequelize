// jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from '../services/jwt.service';
import { ErrorExceptionWithResponse } from '../exceptions/error.exception';
import { constant } from '../helpers/constant';

/*------------------------------------------------------------------------- [ Jwt Auth Guard ] -------------------------------------------------------------------------*/

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.TOKEN_EMPTY,
        );
      }

      const { userId }: any = await this.jwtAuthService.verifyToken(token);

      if (!userId)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          false,
          constant.INVALID_TOKEN,
        );

      request.userId = userId;

      return true;
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    }
  }
}
