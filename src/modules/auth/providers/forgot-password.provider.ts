import { Injectable, Scope } from '@nestjs/common';
import { ITokenPayload } from './interfaces';
import { UserVerificationTokenDto } from '../dtos';
import { CreateTokenProvider } from './create-token.provider';
import { TokenType } from './enums';
import { ErrorService } from '@/common/exceptions';
import { UserEntity } from '@/modules/user/entities';
import { ConfigService } from '@/config';
import { ISendEmailOptions } from '@/shared/mail/interfaces';
import { API_PREFIX, API_VERSION, COMPANY_EST_YEAR } from '@/shared';
import { MailgunService } from '@/shared/mail/mailgun.service';
import { UserFacade } from '@/modules/user/providers';
import { ModuleName } from '@/common/enums';

@Injectable({ scope: Scope.REQUEST })
export class ForgotPasswordProvider {
  constructor(
    private readonly createToken: CreateTokenProvider,
    private readonly errorService: ErrorService,
    private readonly configService: ConfigService,
    private readonly mailgunService: MailgunService,
    private readonly userFacade: UserFacade,
  ) {}

  async execute(dto: UserVerificationTokenDto) {
    const user = await this.userFacade.findOne.execute({
      email: dto.email,
    });
    if (!user) {
      await this.errorService.notFound(ModuleName.Auth, 'user-not-found');
    }

    const tokenPayload: ITokenPayload = {
      user: user as UserEntity,
      type: TokenType.ForgotPassword,
    };

    const tokenData = await this.createToken.execute(tokenPayload);

    const app = this.configService.app;
    const resetUrl = `${app.apiBaseUrl}/${API_PREFIX}/${API_VERSION}/auth/verify-user?email=${user?.email}&token=${tokenData.data.token}`;
    const emailOptions: ISendEmailOptions = {
      to: dto.email,
      subject: `Action required: Reset Your ${app.companyName} Account Password`,
      template: 'forgot-password',
      module: ModuleName.Auth,
      context: {
        companyName: app.companyName,
        supportEmail: app.supportEmail,
        firstName: user?.firstName,
        lastName: user?.lastName,
        resetUrl,
        year: COMPANY_EST_YEAR,
      },
    };
    await this.mailgunService.sendEmail(emailOptions);
  }
}
