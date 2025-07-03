import { Inject, Injectable, Scope } from '@nestjs/common';
import { UserFacade } from '@/modules/user/providers';
import { ConfigService } from '@/config';
import { MailgunService } from '@/shared/mail/mailgun.service';
import { UserPayload } from '@/common/decorators/interfaces';
import { HashService } from '@/common/services';
import { ErrorService } from '@/common/exceptions';
import { RedisService } from '@/shared/redis/redis.service';
import { ExpressRequest } from './interfaces';
import { REQUEST } from '@nestjs/core';
import { deviceFingerprint, timestampWithTimezone } from '@/utils';
import { CreateAuthHistoryProvider } from './create-auth-history.provider';
import { UserEntity } from '@/modules/user/entities';

@Injectable({ scope: Scope.REQUEST })
export class LogoutProvider {
  constructor(
    @Inject(REQUEST) private readonly request: ExpressRequest,
    private readonly userFacade: UserFacade,
    private readonly configService: ConfigService,
    private readonly mailgunService: MailgunService,
    private readonly hashService: HashService,
    private readonly errorService: ErrorService,
    private readonly redisService: RedisService,
    private createAuthHistoryProvider: CreateAuthHistoryProvider,
  ) {}

  async execute(userPayload: UserPayload) {
    const fingerprint = deviceFingerprint(this.request);
    const deviceKey = `auth:${userPayload.id}:${fingerprint}`;
    const userDevicesKey = `auth:${userPayload.id}:devices`;

    const user = await this.userFacade.findOne.execute({
      email: userPayload.email,
    });

    const tokens = await this.redisService.hgetall(deviceKey);
    if (tokens?.accessToken) {
      await this.redisService.set(
        `blacklist:${tokens.accessToken}`,
        '1',
        this.configService.jwt.accessTokenExpiredIn,
      );
    }
    if (tokens?.refreshToken) {
      await this.redisService.set(
        `blacklist:${tokens.refreshToken}`,
        '1',
        this.configService.jwt.refreshTokenExpiredIn,
      );
    }

    await this.redisService.del(deviceKey);
    await this.redisService.srem(userDevicesKey, fingerprint);

    // logout history
    const loggedOutAt = new Date(timestampWithTimezone());
    await this.createAuthHistoryProvider.execute({
      user: user as UserEntity,
      loggedOutAt,
    });
  }
}
