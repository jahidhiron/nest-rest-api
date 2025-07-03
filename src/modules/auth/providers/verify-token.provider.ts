import { Injectable, Scope } from '@nestjs/common';
import { VerificationTokenRepository } from '../repositories';
import { ErrorService } from '@/common/exceptions';
import { UserFacade } from '@/modules/user/providers';
import { IVerificationTokenPayload } from './interfaces';
import { TokenType } from './enums';
import { ModuleName } from '@/common/enums';
import { IConditions } from '@/helpers/interfaces';
import { DbOperator } from '@/helpers/types';

@Injectable({ scope: Scope.REQUEST })
export class VerifyTokenProvider {
  constructor(
    private readonly verificationTokenRepository: VerificationTokenRepository,
    private readonly errorService: ErrorService,
    private readonly userFacade: UserFacade,
  ) {}

  async execute(payload: IVerificationTokenPayload) {
    const user = await this.userFacade.findOne.execute({
      email: payload.email,
    });
    if (!user) {
      await this.errorService.notFound(ModuleName.Auth, 'user-not-found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (user?.verified && payload.token === TokenType.VerifyUser) {
      await this.errorService.conflict(
        ModuleName.Auth,
        'user-already-verified',
      );
    }

    const tokenQuery = {
      user_id: user?.id,
      token: payload.token,
      type: payload.type,
    };
    const conditions: IConditions[] = [
      {
        field: 'expiredAt',
        operator: DbOperator.GreaterThan,
        value: new Date(),
      },
    ];
    const token = await this.verificationTokenRepository.findOne({
      query: tokenQuery,
      conditions,
    });

    if (!token) {
      await this.errorService.badRequest(ModuleName.Auth, 'invalid-token');
    }

    await this.verificationTokenRepository.update(
      { id: user?.id as number },
      {
        applied: true,
      },
    );

    return user;
  }
}
