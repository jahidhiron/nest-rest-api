import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './create-user.provider';
import { UpdateUserProvider } from './update-user.provider';
import { FindOneUserProvider } from './find-one-user.provider';
import { FindUsersProvider } from './find-users.provider';
import { RemoveUserProvider } from './remove-user.provider';
import { UserDetailProvider } from './user-detail.provider';
import { CurrentUserProvider } from './current-user.provider';

@Injectable()
export class UserFacade {
  constructor(
    public readonly create: CreateUserProvider,
    public readonly update: UpdateUserProvider,
    public readonly findOne: FindOneUserProvider,
    public readonly findMany: FindUsersProvider,
    public readonly remove: RemoveUserProvider,
    public readonly userDetail: UserDetailProvider,
    public readonly currentUser: CurrentUserProvider,
  ) {}
}
