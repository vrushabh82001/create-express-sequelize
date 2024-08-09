import { ConfigFactory } from '@nestjs/config';

/*------------------------------------------------------------------------- [ App Config ] -------------------------------------------------------------------------*/

export const appConfig: ConfigFactory = () => ({
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS || 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders:
      process.env.CORS_ALLOWED_HEADERS ||
      'Content-Type,Authorization,X-Requested-With,Accept,*',
  },
  jwtSecret: process.env.JWT_SECRET_KEY || 'vrushabh',
});
