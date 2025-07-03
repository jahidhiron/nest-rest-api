import { UserEntity } from '@/modules/user/entities';

export interface ISigninResponse {
  user: UserEntity;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
