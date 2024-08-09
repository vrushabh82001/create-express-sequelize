// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { MailService } from 'src/shared/services/mail.service';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import { JwtAuthService } from 'src/shared/services/jwt.service';
import { LoggerService } from 'src/shared/services/logger.service';
import { GoogleStrategy } from 'src/shared/strategy/google.strategy';

/*------------------------------------------------------------------------- [ User Module ] -------------------------------------------------------------------------*/

@Module({
  /*------------------------------------------------------------------------- [ Set typeorm Entity and other module] -------------------------------------------------------------------------*/

  imports: [TypeOrmModule.forFeature([User])],

  /*------------------------------------------------------------------------- [ Set Controller ] -------------------------------------------------------------------------*/

  controllers: [UserController],

  /*------------------------------------------------------------------------- [ Set Providers ] -------------------------------------------------------------------------*/

  providers: [
    UserService,
    MailService,
    CloudinaryService,
    JwtAuthService,
    LoggerService,
    GoogleStrategy,
  ],

  /*------------------------------------------------------------------------- [ Export services ] -------------------------------------------------------------------------*/

  exports: [UserService],
})
export class UserModule {}
