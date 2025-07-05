import { UserEntity } from '@/modules/user/entities';

export interface LoginResponse {
  user: UserEntity;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
