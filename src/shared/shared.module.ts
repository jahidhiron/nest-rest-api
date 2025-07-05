import { Module } from '@nestjs/common';
import {
  HashService,
  ResponseService,
  SuccessService,
  TokenService,
} from './services';
import { ConfigModule } from '@/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt';
import { MailModule } from './mail/mail.module';
import { MailgunService } from './mail/mailgun.service';
import { CommonModule } from '@/common/common.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { ResponseProvider } from './providers';

@Module({
  imports: [ConfigModule, JwtModule, MailModule, CommonModule, RedisModule],
  providers: [
    ResponseService,
    SuccessService,
    HashService,
    JwtService,
    MailgunService,
    TokenService,
    RedisService,
    ResponseProvider,
  ],
  exports: [
    SuccessService,
    HashService,
    JwtService,
    MailgunService,
    TokenService,
    RedisService,
    ResponseProvider,
  ],
})
export class SharedModule {}
