import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ExpressRequest, IAuthTokenResponse } from './interfaces';
import { JwtService } from '@/shared/jwt';
import { RedisService } from '@/shared/redis/redis.service';
import { ErrorService } from '@/common/exceptions';
import { ConfigService } from '@/config';
import { deviceFingerprint } from '@/utils';
import { IJwtPayload } from '../interfaces';
import { UserFacade } from '@/modules/user/providers';
import { ModuleName } from '@/common/enums';
import { ICatchError } from '@/common/interfaces';
import { JwtError } from '@/shared/enums';
import { RefreshTokenDto } from '../dtos';

@Injectable({ scope: Scope.REQUEST })
export class RefreshTokenProvider {
  constructor(
    @Inject(REQUEST) private readonly request: ExpressRequest,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly errorService: ErrorService,
    private readonly configService: ConfigService,
    private readonly userFacade: UserFacade,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<IAuthTokenResponse | false> {
    const fingerprint = deviceFingerprint(this.request);

    // Check blacklisted
    const isBlacklisted = await this.redisService.get(
      `blacklist:${dto.refreshToken}`,
    );
    if (isBlacklisted) {
      await this.errorService.unauthorized(ModuleName.Auth, 'unauthorized');
    }

    let payload: IJwtPayload;
    try {
      payload = await this.jwtService.verifyRefreshToken(dto.refreshToken);
    } catch (error: unknown) {
      const err = error as ICatchError;

      if (err.name === (JwtError.TokenExpiredError as string)) {
        await this.errorService.unauthorized(
          ModuleName.Auth,
          'invalid-refresh-token',
        );
      }

      const message =
        err.name === (JwtError.JsonWebTokenError as string)
          ? 'unauthorized'
          : (err.message as string);

      await this.errorService.unauthorized(ModuleName.Auth, message);
      return false;
    }

    const deviceKey = `auth:${payload.sub}:${fingerprint}`;
    const savedTokens = await this.redisService.hgetall(deviceKey);

    if (savedTokens?.refreshToken !== dto.refreshToken) {
      await this.errorService.unauthorized(
        ModuleName.Auth,
        'invalid-refresh-token',
      );
    }

    // Blacklist old tokens
    if (savedTokens?.accessToken) {
      await this.redisService.set(
        `blacklist:${savedTokens.accessToken}`,
        '1',
        this.configService.jwt.accessTokenExpiredIn,
      );
    }
    if (savedTokens?.refreshToken) {
      await this.redisService.set(
        `blacklist:${savedTokens.refreshToken}`,
        '1',
        this.configService.jwt.refreshTokenExpiredIn,
      );
    }

    // Generate new tokens
    const newPayload: IJwtPayload = {
      sub: payload.sub,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      verified: payload.verified,
    };

    const accessToken = await this.jwtService.generateAccessToken(newPayload);
    const newRefreshToken =
      await this.jwtService.generateRefreshToken(newPayload);

    await this.redisService.hmset(deviceKey, {
      accessToken,
      refreshToken: newRefreshToken,
    });
    await this.redisService.expire(
      deviceKey,
      this.configService.jwt.refreshTokenExpiredIn,
    );

    return {
      token: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    };
  }
}
