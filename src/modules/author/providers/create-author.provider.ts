import { Injectable } from '@nestjs/common';
import { AuthorRepository } from '../repositories';
import { AuthorEntity } from '../entities';
import { UserEntity } from '@/modules/user/entities';

@Injectable()
export class CreateAuthorProvider {
  constructor(private authorRepository: AuthorRepository) {}

  async execute(author: Partial<AuthorEntity>, user: UserEntity) {
    const payload = {
      ...author,
      user: user as UserEntity,
    };
    return await this.authorRepository.create(payload);
  }
}
