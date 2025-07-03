import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthFacade } from './providers';
import { UserEntity } from '../user/entities';
import { Serialize } from '@/common';
import { GetUserDto } from '../user/dto';
import { SuccessService } from '@/shared/services';
import { ISigninResponse } from './interfaces';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  GetSigninDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SigninDto,
  SignupDto,
  UserVerificationTokenDto,
  VerifyUserDto,
} from './dtos';
import {
  ChangePasswordSwaggerDocs,
  ForgotPasswordSwaggerDocs,
  LogoutDocs,
  RefreshTokenSwaggerDocs,
  ResetPasswordSwaggerDocs,
  SigninSwaggerDocs,
  SignupSwaggerDocs,
  UserVerificationSwaggerDocs,
  VerifyUserSwaggerDocs,
} from './swaggers';
import { AuthGuard } from '@/common/guards';
import { User } from '@/common/decorators';
import { UserPayload } from '@/common/decorators/interfaces';
import { ModuleName } from '@/common/enums';
import { IAuthTokenResponse } from './providers/interfaces';

@Controller(ModuleName.Auth)
export class AuthController {
  constructor(
    private readonly successService: SuccessService,
    private readonly authFacade: AuthFacade,
  ) {}

  @Serialize(GetUserDto)
  @Post('signup')
  @SignupSwaggerDocs()
  async signUp(@Body() dto: SignupDto) {
    const result = await this.authFacade.signup.execute(dto);
    return this.successService.created<UserEntity>(
      ModuleName.Auth,
      'signup',
      result,
    );
  }

  @Serialize(GetSigninDto)
  @Post('signin')
  @SigninSwaggerDocs()
  async signIn(@Body() dto: SigninDto) {
    const result = await this.authFacade.signin.execute(dto);
    return this.successService.ok<ISigninResponse>(
      ModuleName.Auth,
      'signin',
      result,
    );
  }

  @Post('refresh-token')
  @RefreshTokenSwaggerDocs()
  async refreshToken(@Body() dto: RefreshTokenDto) {
    const result = (await this.authFacade.refreshToken.execute(
      dto,
    )) as IAuthTokenResponse;
    return this.successService.ok<IAuthTokenResponse>(
      ModuleName.Auth,
      'refresh-token',
      result,
    );
  }

  @Post('user-verification-token')
  @UserVerificationSwaggerDocs()
  async userVerificationToken(@Body() dto: UserVerificationTokenDto) {
    await this.authFacade.userVerification.execute(dto);
    return this.successService.ok(ModuleName.Auth, 'user-verification-token');
  }

  @Post('verify-user')
  @VerifyUserSwaggerDocs()
  async verifyUser(@Body() dto: VerifyUserDto) {
    await this.authFacade.userVerifyToken.execute(dto);
    return this.successService.ok(ModuleName.Auth, 'verify-user');
  }

  @Post('forgot-password')
  @ForgotPasswordSwaggerDocs()
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authFacade.forgotPassword.execute(dto);
    return this.successService.ok(ModuleName.Auth, 'forgot-password-token');
  }

  @Post('reset-password')
  @ResetPasswordSwaggerDocs()
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authFacade.resetPassword.execute(dto);
    return this.successService.ok(ModuleName.Auth, 'password-reset');
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @ChangePasswordSwaggerDocs()
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @User() user: UserPayload,
  ) {
    await this.authFacade.changePassword.execute(dto, user);
    return this.successService.ok(ModuleName.Auth, 'change-password');
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  @LogoutDocs()
  async logout(@User() user: UserPayload) {
    await this.authFacade.logout.execute(user);
    return this.successService.ok(ModuleName.Auth, 'logout');
  }
}
