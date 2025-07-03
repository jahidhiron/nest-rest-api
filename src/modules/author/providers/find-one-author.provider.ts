import { Injectable } from '@nestjs/common';
import { QueryFilter } from '@/shared/types';
import { AuthorRepository } from '../repositories';
import { AuthorEntity } from '../entities';

@Injectable()
export class FindOneAuthorProvider {
  constructor(private authorRepository: AuthorRepository) {}

  execute(query: QueryFilter<AuthorEntity>): Promise<AuthorEntity | null> {
    return this.authorRepository.findOne({ query });
  }
}
