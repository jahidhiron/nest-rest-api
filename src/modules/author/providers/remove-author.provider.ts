import { Injectable } from '@nestjs/common';
import { AuthorRepository } from '../repositories';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';
import { AuthorEntity } from '../entities';

@Injectable()
export class RemoveAuthorProvider {
  constructor(
    private authorRepository: AuthorRepository,
    private errorService: ErrorService,
  ) {}

  async execute(id: number): Promise<AuthorEntity> {
    const author = await this.authorRepository.remove({ id });

    if (!author) {
      await this.errorService.notFound(ModuleName.Author, 'author-not-found');
    }

    return author as AuthorEntity;
  }
}
