import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, JwtConfigService } from './jwt';
import { typeOrmAsyncConfig } from './db';
import { WinstonModule } from 'nest-winston';
import { createWinstonConfig } from './winston';
import { sqliteDbConfig, SqliteDbConfigService } from './db';
import { appConfig, AppConfigService } from './app';
import { swaggerConfig, SwaggerConfigService } from './swagger';
import { ConfigService } from './config.service';
import {
  HeaderResolver,
  QueryResolver,
  CookieResolver,
  I18nModule,
} from 'nestjs-i18n';
import { I18nLoader } from './i18n.config';
import { MailConfigService, mailgunConfig } from './mail';
import { redisConfig, RedisConfigService } from './redis';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        sqliteDbConfig,
        appConfig,
        swaggerConfig,
        jwtConfig,
        mailgunConfig,
        redisConfig,
      ],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmAsyncConfig,
      inject: [ConfigService],
    }),

    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: createWinstonConfig,
      inject: [ConfigService],
    }),

    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nLoader,
      loaderOptions: {},
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        HeaderResolver,
        { use: CookieResolver, options: ['i18n-lang'] },
      ],
    }),
  ],

  providers: [
    SqliteDbConfigService,
    AppConfigService,
    SwaggerConfigService,
    JwtConfigService,
    MailConfigService,
    RedisConfigService,
    ConfigService,
  ],

  exports: [ConfigService],
})
export class ConfigModule {}
