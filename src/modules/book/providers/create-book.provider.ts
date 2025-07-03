import { Injectable } from '@nestjs/common';
import { BookRepository } from '../repositories';
import { UserPayload } from '@/common/decorators/interfaces';
import { CreateBookDto } from '../dtos';
import { UserFacade } from '@/modules/user/providers';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';
import { UserEntity } from '@/modules/user/entities';
import { FindOneBookProvider } from './find-one-book.provider';

@Injectable()
export class CreateBookProvider {
  constructor(
    private bookRepository: BookRepository,
    private userFacade: UserFacade,
    private errorService: ErrorService,
    private findOneBookProvider: FindOneBookProvider,
  ) {}

  async execute(dto: CreateBookDto, userPayload: UserPayload) {
    const user = await this.userFacade.findOne.execute({ id: userPayload.id });
    if (!user) {
      await this.errorService.notFound(ModuleName.User, 'user-not-found');
    }

    const existingIsbn = await this.findOneBookProvider.execute({
      isbn: dto.isbn,
    });

    if (existingIsbn) {
      await this.errorService.conflict(ModuleName.Book, 'isbn-already-exist');
    }

    const existingUser = user as UserEntity;
    const bookPayload = { ...dto, author: existingUser };
    return await this.bookRepository.create(bookPayload);
  }
}
