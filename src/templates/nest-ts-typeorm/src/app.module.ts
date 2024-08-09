import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cors from 'cors';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from './config/app.config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ErrorExceptionFilter } from './shared/filters/error.filter';
import { CustomValidationPipe } from './shared/pipes/validation.pipe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/db.config';
import { UserModule } from './modules/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './config/multer.config';

import { LoggerService } from './shared/services/logger.service';
import { CloudinaryService } from './shared/services/cloudinary.service';
import { JwtAuthService } from './shared/services/jwt.service';
import { AuthMiddleware } from './shared/middlewares/auth/auth.middleware';
import { AuthRoutes } from './shared/middlewares/auth/auth.routes';

/*------------------------------------------------------------------------- [ App Module ] -------------------------------------------------------------------------*/

@Module({
  /*------------------------------------------------------------------------- [ import modules and configuation ] -------------------------------------------------------------------------*/

  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    MulterModule.register(multerConfig),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
    }),
    UserModule,
  ],

  /*------------------------------------------------------------------------- [ Set Controller ] -------------------------------------------------------------------------*/

  controllers: [AppController],

  /*------------------------------------------------------------------------- [ Set Providers ] -------------------------------------------------------------------------*/

  providers: [
    AppService,
    JwtAuthService,
    LoggerService,
    CloudinaryService,

    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const corsOptions = {
      origin: this.configService.get<string>('cors.origin'),
      methods: this.configService.get<string>('cors.methods'),
      allowedHeaders: this.configService.get<string>('cors.allowedHeaders'),
    };

    /*------------------------------------------------------------------------- [ Set Cors for all routes ] -------------------------------------------------------------------------*/

    consumer.apply(cors(corsOptions)).forRoutes('*');

    /*------------------------------------------------------------------------- [ Set Auth middleware for auth routes ] -------------------------------------------------------------------------*/

    consumer.apply(AuthMiddleware).forRoutes(...AuthRoutes);
  }
}
