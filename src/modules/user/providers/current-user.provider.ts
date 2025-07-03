import { Injectable } from '@nestjs/common';
import { AuthorFacade } from '@/modules/author/providers';
import { AuthorEntity } from '@/modules/author/entities';
import { ICurrentUser, UserPayload } from '@/common/decorators/interfaces';
import { Role } from '@/common/enums';

@Injectable()
export class CurrentUserProvider {
  constructor(private authorFacade: AuthorFacade) {}

  async execute(user: UserPayload): Promise<ICurrentUser> {
    const result: ICurrentUser = { ...user };
    if (user.role === (Role.AUTHOR as string)) {
      const author = await this.authorFacade.findOne.execute({
        userId: user.id as number,
      });

      if (author) {
        result.author = author as AuthorEntity;
      }
    }

    return result;
  }
}
