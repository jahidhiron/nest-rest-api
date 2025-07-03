import { Injectable } from '@nestjs/common';
import { SignupProvider } from './signup.provider';
import { SigninProvider } from './signin.provider';
import { CreateTokenProvider } from './create-token.provider';
import { UserVerificationTokenProvider } from './user-verification-token.provider';
import { VerifyTokenProvider } from './verify-token.provider';
import { UserVerifyTokenProvider } from './user-verify-token.provider';
import { ForgotPasswordProvider } from './forgot-password.provider';
import { ResetPasswordProvider } from './reset-password.provider';
import { ChangePasswordProvider } from './change-password.provider';
import { LogoutProvider } from './logout.provider';
import { RefreshTokenProvider } from './refresh-token.provider';
import { CreateAuthHistoryProvider } from './create-auth-history.provider';

@Injectable()
export class AuthFacade {
  constructor(
    public readonly signup: SignupProvider,
    public readonly signin: SigninProvider,
    public readonly createToken: CreateTokenProvider,
    public readonly userVerification: UserVerificationTokenProvider,
    public readonly verifyToken: VerifyTokenProvider,
    public readonly userVerifyToken: UserVerifyTokenProvider,
    public readonly forgotPassword: ForgotPasswordProvider,
    public readonly resetPassword: ResetPasswordProvider,
    public readonly changePassword: ChangePasswordProvider,
    public readonly logout: LogoutProvider,
    public readonly refreshToken: RefreshTokenProvider,
    public readonly createAuthHistory: CreateAuthHistoryProvider,
  ) {}
}
