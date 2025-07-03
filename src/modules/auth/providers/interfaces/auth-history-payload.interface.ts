import { UserEntity } from '@/modules/user/entities';

export interface IAuthHistoryPayload {
  user: UserEntity;
  loggedOutAt?: Date;
}
