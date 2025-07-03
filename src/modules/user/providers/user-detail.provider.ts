import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { ICurrentUser, UserPayload } from '@/common/decorators/interfaces';
import { ModuleName, Role } from '@/common/enums';
import { ErrorService } from '@/common/exceptions';
import { FindOneUserProvider } from './find-one-user.provider';
import { AuthorFacade } from '@/modules/author/providers';
import { AuthorEntity } from '@/modules/author/entities';

@Injectable()
export class UserDetailProvider {
  constructor(
    private errorService: ErrorService,
    private findOneUserProvider: FindOneUserProvider,
    private authorFacade: AuthorFacade,
  ) {}

  async execute(id: number, userPayload: UserPayload): Promise<ICurrentUser> {
    if (userPayload.role !== Role.ADMIN && userPayload.id !== id) {
      await this.errorService.unauthorized(
        ModuleName.Auth,
        'permission-denied',
      );
    }

    const user = await this.findOneUserProvider.execute({ id });

    if (!user) {
      await this.errorService.notFound(ModuleName.User, 'user-not-found');
    }

    const existingUser = user as UserEntity;
    const result: ICurrentUser = { ...existingUser };

    if (userPayload.role === (Role.AUTHOR as string)) {
      const author = await this.authorFacade.findOne.execute({
        userId: userPayload.id as number,
      });

      if (author) {
        const existingAuthor = author as AuthorEntity;
        result.author = existingAuthor;
      }
    }

    return result;
  }
}
