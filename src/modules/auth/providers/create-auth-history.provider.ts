import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { clientIp, deviceFingerprint } from '@/utils';
import { ExpressRequest, IAuthHistoryPayload } from './interfaces';
import { LoginHistoryRepository } from '../repositories/login-history.repository';

@Injectable({ scope: Scope.REQUEST })
export class CreateAuthHistoryProvider {
  constructor(
    @Inject(REQUEST) private readonly request: ExpressRequest,
    private readonly loginHistoryRepo: LoginHistoryRepository,
  ) {}

  async execute(payload: IAuthHistoryPayload) {
    const ip = clientIp(this.request);
    const deviceInfo = deviceFingerprint(this.request);
    const body = { ...payload, ip, deviceInfo };
    return this.loginHistoryRepo.create(body);
  }
}
