import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthService } from '../../services/jwt.service';
import { UserService } from '../../../modules/user/user.service';
import { ErrorExceptionWithResponse } from '../../exceptions/error.exception';
import { constant } from '../../helpers/constant';

/*------------------------------------------------------------------------- [ Auth Middleware ] -------------------------------------------------------------------------*/

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      req['user'] = (await this.userService.getUserById(req['userId']))?.result;

      if (req['user'] && req['user'].isVerify === false) {
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.PLEASE_CONFIRM_REGISTRATION,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
