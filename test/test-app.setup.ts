import { INestApplication, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { ConfigService } from '@/config';
import {
  AppLogger,
  GlobalExceptionFilter,
  HttpErrorFilter,
  LoggingInterceptor,
} from '@/common';
import { DeserializeQuery, validationPipe } from '@/common/pipes';
import { API_PREFIX, API_VERSION_NUMBER } from '@/shared';

jest.setTimeout(30_000);

export async function createTestApp(): Promise<INestApplication> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  const configService = app.get(ConfigService) as ConfigService;
  const logger = app.get(AppLogger);
  app.useLogger(logger);

  app.useGlobalPipes(validationPipe());

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

  await app.init();

  return app;
}
