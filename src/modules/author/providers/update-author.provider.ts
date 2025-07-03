import { Injectable } from '@nestjs/common';
import { AuthorRepository } from '../repositories';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';
import { AuthorEntity } from '../entities';

@Injectable()
export class UpdateAuthorProvider {
  constructor(
    private authorRepository: AuthorRepository,
    private errorService: ErrorService,
  ) {}

  async execute(
    id: number,
    data: Partial<AuthorEntity>,
  ): Promise<AuthorEntity> {
    const author = await this.authorRepository.update({ id }, data);

    if (!author) {
      await this.errorService.notFound(ModuleName.Author, 'author-not-found');
    }

    return author as AuthorEntity;
  }
}
