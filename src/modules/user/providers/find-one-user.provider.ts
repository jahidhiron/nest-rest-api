import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories';
import { QueryFilter } from '@/shared/types';

@Injectable()
export class FindOneUserProvider {
  constructor(private userRepository: UserRepository) {}

  execute(query: QueryFilter<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne({ query });
  }
}
