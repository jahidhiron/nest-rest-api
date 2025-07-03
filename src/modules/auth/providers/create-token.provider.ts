import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TokenService } from '@/shared/services';
import { EXPIRED_AFTER_MINUTES } from '@/shared';
import { clientIp, timestampWithTimezone } from '@/utils';
import { ExpressRequest, ITokenPayload } from './interfaces';
import { VerificationTokenRepository } from '../repositories';

@Injectable({ scope: Scope.REQUEST })
export class CreateTokenProvider {
  constructor(
    @Inject(REQUEST) private readonly request: ExpressRequest,
    private readonly tokenService: TokenService,
    private readonly verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute(payload: ITokenPayload) {
    const ip = clientIp(this.request);

    const now = new Date();
    const expectedDatetime = new Date(
      now.getTime() + EXPIRED_AFTER_MINUTES * 60 * 1000,
    );
    const expiredAtStr = timestampWithTimezone(expectedDatetime);
    const token = this.tokenService.generateToken();

    const body = {
      ...payload,
      token,
      expiredAt: new Date(expiredAtStr),
      ip,
      applied: false,
    };

    const newToken = await this.verificationTokenRepository.create(body);

    return { data: newToken };
  }
}
