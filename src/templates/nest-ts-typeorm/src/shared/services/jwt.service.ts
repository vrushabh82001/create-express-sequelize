// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/*------------------------------------------------------------------------- [ Jwt Service ] -------------------------------------------------------------------------*/
@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /*------------------------------------------------------------------------- [ generate jwt token ] -------------------------------------------------------------------------*/

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  /*------------------------------------------------------------------------- [ verify jwt token ] -------------------------------------------------------------------------*/

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  /*------------------------------------------------------------------------- [ decode jwt token ] -------------------------------------------------------------------------*/

  async decodeToken(token: string): Promise<any> {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      return null;
    }
  }

  /*------------------------------------------------------------------------- [ get token Expiration Time In Env ] -------------------------------------------------------------------------*/

  getExpirationTime(): number {
    return this.configService.get<number>('JWT_EXPIRATION_TIME');
  }
}
