import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories';
import { HashService } from '@/common/services';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';

@Injectable()
export class UpdateUserProvider {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
    private errorService: ErrorService,
  ) {}

  async execute(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    if (data.password) {
      const password = data.password;
      data.password = await this.hashService.hash(password);
    }

    const user = await this.userRepository.update({ id }, data);

    if (!user) {
      await this.errorService.notFound(ModuleName.User, 'user-not-found');
    }

    return user as UserEntity;
  }
}
