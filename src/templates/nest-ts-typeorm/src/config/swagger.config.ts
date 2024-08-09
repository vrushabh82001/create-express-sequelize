import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { swaggerConstant } from 'src/shared/helpers/constant';

/*------------------------------------------------------------------------- [ Swagger Config ] -------------------------------------------------------------------------*/

export function swaggerConfig(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle(swaggerConstant.TITLE)
    .setDescription(swaggerConstant.DESCRIPTION)
    .setVersion(swaggerConstant.VERSION)
    .addBearerAuth({
      type: 'http',
      in: 'header',
      name: 'Authorization',
      description: swaggerConstant.BEARERAUTH_DESCRIPTION,
      scheme: 'bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);
}
