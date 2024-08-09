import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { swaggerConfig } from './config/swagger.config';

/*------------------------------------------------------------------------- [ main ] -------------------------------------------------------------------------*/

async function main() {
  dotenv.config();
  /*------------------------------------------------------------------------- [ create app ] -------------------------------------------------------------------------*/

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  /*------------------------------------------------------------------------- [ set up swagger ] -------------------------------------------------------------------------*/

  swaggerConfig(app);

  /*------------------------------------------------------------------------- [ listen app ] -------------------------------------------------------------------------*/

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main();
