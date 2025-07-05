import { Inject, Injectable, Scope } from '@nestjs/common';
import { UserFacade } from '@/modules/user/providers';
import { ErrorService } from '@/common/exceptions';
import { SigninDto } from '../dtos/signin.dto';
import { HashService } from '@/shared/services';
import { IJwtPayload } from '../interfaces';
import { JwtService } from '@/shared/jwt';
import { UserEntity } from '@/modules/user/entities';
import { RedisService } from '@/shared/redis/redis.service';
import { REQUEST } from '@nestjs/core';
import { ExpressRequest } from './interfaces';
import { deviceFingerprint } from '@/utils';
import { MAX_LOGIN_DEVICE_LIMIT } from '@/shared';
import { ConfigService } from '@/config';
import { ModuleName } from '@/common/enums';
import { CreateAuthHistoryProvider } from './create-auth-history.provider';

@Injectable({ scope: Scope.REQUEST })
export class SigninProvider {
  constructor(
    @Inject(REQUEST) private readonly request: ExpressRequest,
    private userFacade: UserFacade,
    private createAuthHistoryProvider: CreateAuthHistoryProvider,
    private errorService: ErrorService,
    private hashService: HashService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  async execute(dto: SigninDto) {
    const user = await this.userFacade.findOne.execute({ email: dto.email });

    const fingerprint = deviceFingerprint(this.request);
    const deviceKey = `auth:${user?.id}:${fingerprint}`;
    const userDevicesKey = `auth:${user?.id}:devices`;

    const existingDevices = await this.redisService.smembers(userDevicesKey);
    if (
      !existingDevices.includes(fingerprint) &&
      existingDevices.length >= MAX_LOGIN_DEVICE_LIMIT
    ) {
      await this.errorService.forbidden(
        ModuleName.Auth,
        `max-login-device-limit`,
        undefined,
        {
          maxLoginDeviceLimit: MAX_LOGIN_DEVICE_LIMIT,
        },
      );
    }

    if (!user) {
      await this.errorService.unauthorized(
        ModuleName.Auth,
        'invalid-credentials',
      );
    }

    const isMatchPassword = await this.hashService.verify(
      user?.password as string,
      dto.password,
    );
    if (!isMatchPassword) {
      await this.errorService.unauthorized(
        ModuleName.Auth,
        'invalid-credentials',
      );
    }

    const jwtPayload: IJwtPayload = {
      firstName: user?.firstName as string,
      lastName: user?.lastName as string,
      sub: user?.id as number,
      email: user?.email as string,
      role: user?.role as string,
      verified: user?.verified as boolean,
    };

    // Blacklist old tokens if exists
    const oldTokens = await this.redisService.hgetall(deviceKey);
    if (oldTokens?.accessToken) {
      await this.redisService.set(
        `blacklist:${oldTokens.accessToken}`,
        '1',
        this.configService.jwt.accessTokenExpiredIn,
      );
    }
    if (oldTokens?.refreshToken) {
      await this.redisService.set(
        `blacklist:${oldTokens.refreshToken}`,
        '1',
        this.configService.jwt.refreshTokenExpiredIn,
      );
    }

    // Generate and save new tokens
    const accessToken = await this.jwtService.generateAccessToken(jwtPayload);
    const refreshToken = await this.jwtService.generateRefreshToken(jwtPayload);

    await this.redisService.hmset(deviceKey, { accessToken, refreshToken });
    await this.redisService.expire(
      deviceKey,
      this.configService.jwt.refreshTokenExpiredIn,
    );
    await this.redisService.sadd(userDevicesKey, fingerprint);

    // login history
    await this.createAuthHistoryProvider.execute({
      user: user as UserEntity,
    });

    return { user: user as UserEntity, token: { accessToken, refreshToken } };
  }
}
