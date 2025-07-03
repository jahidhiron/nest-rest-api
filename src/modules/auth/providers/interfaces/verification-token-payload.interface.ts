import { TokenType } from '../enums';

export interface IVerificationTokenPayload {
  type: TokenType;
  email: string;
  token: string;
}
