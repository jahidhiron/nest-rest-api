import { Injectable } from '@nestjs/common';
import { UserPayload } from '@/common/decorators/interfaces';
import { ModuleName, Role } from '@/common/enums';
import { ErrorService } from '@/common/exceptions';
import { FindOneAuthorProvider } from './find-one-author.provider';
import { AuthorEntity } from '../entities';

@Injectable()
export class AuthorDetailProvider {
  constructor(
    private errorService: ErrorService,
    private findOneAuthorProvider: FindOneAuthorProvider,
  ) {}

  async execute(id: number, userPayload: UserPayload): Promise<AuthorEntity> {
    if (userPayload.role !== Role.ADMIN && userPayload.id !== id) {
      await this.errorService.unauthorized(
        ModuleName.Auth,
        'permission-denied',
      );
    }

    const author = await this.findOneAuthorProvider.execute({ id });
    if (!author) {
      await this.errorService.notFound(ModuleName.Author, 'author-not-found');
    }

    return author as AuthorEntity;
  }
}
