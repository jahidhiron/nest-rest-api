import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';

@Injectable()
export class RemoveUserProvider {
  constructor(
    private userRepository: UserRepository,
    private errorService: ErrorService,
  ) {}

  async execute(id: number): Promise<UserEntity> {
    const user = await this.userRepository.remove({ id });

    if (!user) {
      await this.errorService.notFound(ModuleName.User, 'user-not-found');
    }

    return user as UserEntity;
  }
}
