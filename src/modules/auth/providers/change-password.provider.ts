import { Injectable, Scope } from '@nestjs/common';
import { UserFacade } from '@/modules/user/providers';
import { ConfigService } from '@/config';
import { API_PREFIX, API_VERSION, COMPANY_EST_YEAR } from '@/shared';
import { ISendEmailOptions } from '@/shared/mail/interfaces';
import { MailgunService } from '@/shared/mail/mailgun.service';
import { ChangePasswordDto } from '../dtos';
import { UserPayload } from '@/common/decorators/interfaces';
import { HashService } from '@/common/services';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';

@Injectable({ scope: Scope.REQUEST })
export class ChangePasswordProvider {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly configService: ConfigService,
    private readonly mailgunService: MailgunService,
    private readonly hashService: HashService,
    private readonly errorService: ErrorService,
  ) {}

  async execute(payload: ChangePasswordDto, userPayload: UserPayload) {
    const user = await this.userFacade.findOne.execute({
      email: userPayload.email,
    });

    const isMatchPassword = await this.hashService.verify(
      user?.password as string,
      payload.oldPassword,
    );
    if (!isMatchPassword) {
      await this.errorService.forbidden(
        ModuleName.Auth,
        'old-password-not-match',
      );
    }

    await this.userFacade.update.execute(user?.id as number, {
      password: payload.newPassword,
    });

    const app = this.configService.app;
    const loginUrl = `${app.apiBaseUrl}/${API_PREFIX}/${API_VERSION}`;
    const emailOptions: ISendEmailOptions = {
      to: userPayload.email,
      subject: `Your Password Has Been Reset – ${app.companyName}`,
      template: 'change-password',
      module: ModuleName.Auth,
      context: {
        companyName: app.companyName,
        supportEmail: app.supportEmail,
        firstName: userPayload.firstName,
        lastName: userPayload.lastName,
        loginUrl,
        year: COMPANY_EST_YEAR,
      },
    };
    await this.mailgunService.sendEmail(emailOptions);
  }
}
