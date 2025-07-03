import { UserEntity } from '@/modules/user/entities';
import { TokenType } from '../enums';

export interface ITokenPayload {
  type: TokenType;
  user: UserEntity;
}
