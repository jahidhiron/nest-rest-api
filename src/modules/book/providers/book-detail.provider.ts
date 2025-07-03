/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable } from '@nestjs/common';
import { UserPayload } from '@/common/decorators/interfaces';
import { ModuleName, Role } from '@/common/enums';
import { ErrorService } from '@/common/exceptions';
import { FindOneBookProvider } from './find-one-book.provider';
import { BookEntity } from '../entities';

@Injectable()
export class BookDetailProvider {
  constructor(
    private errorService: ErrorService,
    private findOneBookProvider: FindOneBookProvider,
  ) {}

  async execute(id: number, userPayload?: UserPayload): Promise<BookEntity> {
    if (
      userPayload?.role !== undefined &&
      userPayload?.role !== Role.ADMIN &&
      userPayload?.id !== id
    ) {
      await this.errorService.unauthorized(
        ModuleName.Auth,
        'permission-denied',
      );
    }

    const relations = ['author'];
    const book = await this.findOneBookProvider.execute({ id }, [], relations);
    if (!book) {
      await this.errorService.notFound(ModuleName.Book, 'book-not-found');
    }

    return book as BookEntity;
  }
}
