import { Injectable } from '@nestjs/common';
import { SignupDto } from '../dtos/signup.dto';
import { UserFacade } from '@/modules/user/providers';
import { ErrorService } from '@/common/exceptions';
import { MailgunService } from '@/shared/mail/mailgun.service';
import { ISendEmailOptions } from '@/shared/mail/interfaces';
import { ConfigService } from '@/config';
import { API_PREFIX, API_VERSION, COMPANY_EST_YEAR } from '@/shared';
import { CreateTokenProvider } from './create-token.provider';
import { ITokenPayload } from './interfaces';
import { TokenType } from './enums';
import { ModuleName, Role } from '@/common/enums';
import { AuthorFacade } from '@/modules/author/providers';

@Injectable()
export class SignupProvider {
  constructor(
    private userFacade: UserFacade,
    private createToken: CreateTokenProvider,
    private errorService: ErrorService,
    private readonly mailgunService: MailgunService,
    private readonly configService: ConfigService,
    private readonly authorFacade: AuthorFacade,
  ) {}

  async execute(dto: SignupDto) {
    const existingUser = await this.userFacade.findOne.execute({
      email: dto.email,
    });

    if (existingUser) {
      await this.errorService.conflict(ModuleName.Auth, 'email-exist');
    }

    const user = await this.userFacade.create.execute(dto);

    const tokenPayload: ITokenPayload = {
      type: TokenType.VerifyUser,
      user,
    };
    const tokenData = await this.createToken.execute(tokenPayload);

    // if signup as author
    if (dto.role === (Role.AUTHOR as string)) {
      const authorPayload = {
        firstName: dto.firstName,
        lastName: dto.lastName,
      };
      await this.authorFacade.create.execute(authorPayload, user);
    }

    const app = this.configService.app;
    const verifyUrl = `${app.apiBaseUrl}/${API_PREFIX}/${API_VERSION}/auth/verify-user?email=${user.email}&token=${tokenData.data.token}`;
    const emailOptions: ISendEmailOptions = {
      to: dto.email,
      subject: 'Verify Your Account',
      template: 'signup',
      module: ModuleName.Auth,
      context: {
        companyName: app.companyName,
        supportEmail: app.supportEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        verifyUrl,
        year: COMPANY_EST_YEAR,
      },
    };
    await this.mailgunService.sendEmail(emailOptions);

    return user;
  }
}
