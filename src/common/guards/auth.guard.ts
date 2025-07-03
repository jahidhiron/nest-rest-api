import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@/shared/jwt';
import { ErrorService } from '../exceptions';
import { ModuleName } from '../enums';
import { ICatchError } from '../interfaces';
import { IJwtPayload } from '@/modules/auth/interfaces';
import { UserPayload } from '../decorators/interfaces';
import { RedisService } from '@/shared/redis/redis.service';
import { JwtError } from '@/shared/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly errorService: ErrorService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user?: UserPayload;
    };

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      await this.errorService.unauthorized(
        ModuleName.Common,
        'auth-token-required',
      );
      return false;
    }

    let payload: IJwtPayload;
    const token = authHeader.split(' ')[1];

    const isBlacklisted = await this.redisService.get(`blacklist:${token}`);
    if (isBlacklisted) {
      await this.errorService.unauthorized(ModuleName.Common, 'unauthorized');
    }

    try {
      payload = await this.jwtService.verifyAccessToken(token);
    } catch (error: unknown) {
      const err = error as ICatchError;

      if (err.name === (JwtError.TokenExpiredError as string)) {
        await this.errorService.unauthorized(
          ModuleName.Common,
          'token-expired',
        );
      }

      const message =
        err.name === (JwtError.JsonWebTokenError as string)
          ? 'unauthorized'
          : (err.message as string);

      await this.errorService.unauthorized(ModuleName.Common, message);
      return false;
    }

    const { sub: id, firstName, lastName, email, role, verified } = payload;
    req.user = { id, firstName, lastName, email, role, verified };
    return true;
  }
}
