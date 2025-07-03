import { Injectable, Scope } from '@nestjs/common';
import { UserFacade } from '@/modules/user/providers';
import { TokenType } from './enums';
import { VerifyUserDto } from '../dtos/verify-user.dto';
import { VerifyTokenProvider } from './verify-token.provider';
import { IVerificationTokenPayload } from './interfaces';
import { ConfigService } from '@/config';
import { API_PREFIX, API_VERSION, COMPANY_EST_YEAR } from '@/shared';
import { ISendEmailOptions } from '@/shared/mail/interfaces';
import { MailgunService } from '@/shared/mail/mailgun.service';
import { ModuleName } from '@/common/enums';

@Injectable({ scope: Scope.REQUEST })
export class UserVerifyTokenProvider {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly verifyTokenProvider: VerifyTokenProvider,
    private readonly configService: ConfigService,
    private readonly mailgunService: MailgunService,
  ) {}

  async execute(dto: VerifyUserDto) {
    const payload: IVerificationTokenPayload = {
      type: TokenType.VerifyUser,
      email: dto.email,
      token: dto.token,
    };
    const user = await this.verifyTokenProvider.execute(payload);

    await this.userFacade.update.execute(user?.id as number, {
      verified: true,
    });

    const app = this.configService.app;
    const loginUrl = `${app.apiBaseUrl}/${API_PREFIX}/${API_VERSION}`;
    const emailOptions: ISendEmailOptions = {
      to: dto.email,
      subject: `Welcome to ${app.companyName} – Your Email is Verified`,
      template: 'verify-user',
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
