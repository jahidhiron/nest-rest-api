import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { CommonModule } from '@/common/common.module';
import { SignupProvider } from './providers/signup.provider';
import { AuthFacade } from './providers';
import { SigninProvider } from './providers/signin.provider';
import { SharedModule } from '@/shared/shared.module';
import { ConfigModule } from '@/config';
import { VerificationTokenRepository } from './repositories';
import { CreateTokenProvider } from './providers/create-token.provider';
import { UserVerificationTokenProvider } from './providers/user-verification-token.provider';
import { VerifyTokenProvider } from './providers/verify-token.provider';
import { UserVerifyTokenProvider } from './providers/user-verify-token.provider';
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { ResetPasswordProvider } from './providers/reset-password.provider';
import { HashService } from '@/common/services';
import { ChangePasswordProvider } from './providers/change-password.provider';
import { LogoutProvider } from './providers/logout.provider';
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { CreateAuthHistoryProvider } from './providers/create-auth-history.provider';
import { LoginHistoryRepository } from './repositories/login-history.repository';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [
    CommonModule,
    SharedModule,
    UserModule,
    ConfigModule,
    forwardRef(() => AuthorModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthFacade,
    SignupProvider,
    SigninProvider,
    VerificationTokenRepository,
    CreateTokenProvider,
    UserVerificationTokenProvider,
    VerifyTokenProvider,
    UserVerifyTokenProvider,
    ForgotPasswordProvider,
    ResetPasswordProvider,
    ChangePasswordProvider,
    LogoutProvider,
    RefreshTokenProvider,
    CreateAuthHistoryProvider,
    LoginHistoryRepository,
    HashService,
  ],
  exports: [AuthModule],
})
export class AuthModule {}
