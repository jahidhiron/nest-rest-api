import { Injectable, Scope } from '@nestjs/common';
import { UserFacade } from '@/modules/user/providers';
import { TokenType } from './enums';
import { VerifyTokenProvider } from './verify-token.provider';
import { IVerificationTokenPayload } from './interfaces';
import { ConfigService } from '@/config';
import { API_PREFIX, API_VERSION, COMPANY_EST_YEAR } from '@/shared';
import { ISendEmailOptions } from '@/shared/mail/interfaces';
import { MailgunService } from '@/shared/mail/mailgun.service';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { HashService } from '@/common/services';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';

@Injectable({ scope: Scope.REQUEST })
export class ResetPasswordProvider {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly verifyTokenProvider: VerifyTokenProvider,
    private readonly configService: ConfigService,
    private readonly mailgunService: MailgunService,
    private readonly hashService: HashService,
    private readonly errorService: ErrorService,
  ) {}

  async execute(dto: ResetPasswordDto) {
    const payload: IVerificationTokenPayload = {
      type: TokenType.ForgotPassword,
      email: dto.email,
      token: dto.token,
    };
    const user = await this.verifyTokenProvider.execute(payload);

    const isMatchPassword = await this.hashService.verify(
      user?.password as string,
      dto.password,
    );
    if (isMatchPassword) {
      await this.errorService.forbidden(ModuleName.Auth, 'match-old-password');
    }

    await this.userFacade.update.execute(user?.id as number, {
      password: dto.password,
    });

    const app = this.configService.app;
    const loginUrl = `${app.apiBaseUrl}/${API_PREFIX}/${API_VERSION}`;
    const emailOptions: ISendEmailOptions = {
      to: dto.email,
      subject: `Your Password Has Been Reset – ${app.companyName}`,
      template: 'reset-password',
      module: ModuleName.Auth,
      context: {
        companyName: app.companyName,
        supportEmail: app.supportEmail,
        firstName: user?.firstName,
        lastName: user?.lastName,
        loginUrl,
        year: COMPANY_EST_YEAR,
      },
    };
    await this.mailgunService.sendEmail(emailOptions);
  }
}
