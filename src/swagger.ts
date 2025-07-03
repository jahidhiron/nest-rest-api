import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  SWAGGER_BEARER_AUTH,
  SWAGGER_BEARER_AUTH_NAME,
  SWAGGER_CONFIG,
  SWAGGER_DESCRIPTION,
  SWAGGER_PATH,
  SWAGGER_TITLE,
  SWAGGER_VERSION,
} from './shared';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_VERSION)
    .addBearerAuth(SWAGGER_BEARER_AUTH, SWAGGER_BEARER_AUTH_NAME)
    .addServer(process.env.SWAGGER_LIVE_BASE_URL as string, 'Staging server')
    .addServer(
      process.env.SWAGGER_DEVELOPMENT_BASE_URL as string,
      'Local development server',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_PATH, app, document, SWAGGER_CONFIG);
}
