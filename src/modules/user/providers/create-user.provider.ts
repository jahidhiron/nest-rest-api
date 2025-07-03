import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { HashService } from '@/shared/services';
import { UserRepository } from '../repositories';

@Injectable()
export class CreateUserProvider {
  constructor(
    private hashService: HashService,
    private userRepository: UserRepository,
  ) {}

  async execute(user: Partial<UserEntity>) {
    const hashedPassword = await this.hashService.hash(user.password as string);
    user.password = hashedPassword;
    const newUser = await this.userRepository.create(user);

    return newUser;
  }
}
