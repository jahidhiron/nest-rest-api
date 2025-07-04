import { Injectable } from '@nestjs/common';
import { CreateAuthorProvider } from './create-author.provider';
import { UpdateAuthorProvider } from './update-author.provider';
import { FindOneAuthorProvider } from './find-one-author.provider';
import { FindAuthorsProvider } from './find-authors.provider';
import { AuthorDetailProvider } from './author-detail.provider';
import { RemoveAuthorProvider } from './remove-author.provider';

@Injectable()
export class AuthorFacade {
  constructor(
    public readonly create: CreateAuthorProvider,
    public readonly update: UpdateAuthorProvider,
    public readonly findOne: FindOneAuthorProvider,
    public readonly findMany: FindAuthorsProvider,
    public readonly remove: RemoveAuthorProvider,
    public readonly userDetail: AuthorDetailProvider,
  ) {}
}
