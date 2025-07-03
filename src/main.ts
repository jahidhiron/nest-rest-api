/* eslint-disable @typescript-eslint/no-floating-promises */
import * as fs from 'fs';
import * as path from 'path';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AppLogger,
  GlobalExceptionFilter,
  HttpErrorFilter,
  LoggingInterceptor,
} from './common';
import {
  ALLOW_METHODS,
  API_PREFIX,
  API_VERSION_NUMBER,
  LOG_DIR,
  SWAGGER_PATH,
} from './shared';
import { VersioningType } from '@nestjs/common';
import { setupSwagger } from './swagger';
import { ConfigService } from './config';
import { DeserializeQuery, validationPipe } from './common/pipes';

async function bootstrap() {
  // Logs directory
  const logDir = path.join(__dirname, '..', LOG_DIR);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  const port = configService.app.port;
  const swaggerUser = configService.swagger.user;
  const swaggerPassword = configService.swagger.password;

  // Logger
  const logger = app.get(AppLogger);
  app.useLogger(logger);

  // Security middleware
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.app.corsOrigin || '*',
    methods: ALLOW_METHODS,
    credentials: true,
  });

  // validation pipe
  app.useGlobalPipes(validationPipe());

  // API prefix
  app.setGlobalPrefix(API_PREFIX);

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION_NUMBER,
  });

  // Global interceptors and filters
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new HttpErrorFilter(logger));
  app.useGlobalFilters(new GlobalExceptionFilter(logger, configService));
  app.useGlobalPipes(new DeserializeQuery());

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  // Setup Swagger
  app.use(
    `/${SWAGGER_PATH}`,
    basicAuth({
      challenge: true,
      users: {
        [swaggerUser]: swaggerPassword,
      },
      unauthorizedResponse: () => 'Unauthorized',
    }),
  );
  setupSwagger(app);

  // Start server
  await app.listen(port);
  logger.log(`Application started on port ${port}`, 'Bootstrap');
}

bootstrap();
