import { Injectable } from '@nestjs/common';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';
import { BookRepository } from '../repositories';
import { BookEntity } from '../entities';
import { FindOneBookProvider } from './find-one-book.provider';
import { IConditions } from '@/helpers/interfaces';
import { DbOperator } from '@/helpers/types';

@Injectable()
export class UpdateBookProvider {
  constructor(
    private bookRepository: BookRepository,
    private errorService: ErrorService,
    private findOneBookProvider: FindOneBookProvider,
  ) {}

  async execute(id: number, data: Partial<BookEntity>): Promise<BookEntity> {
    const conditions: IConditions[] = [
      { field: 'id', operator: DbOperator.NotEqual, value: id },
    ];

    const existingIsbn = await this.findOneBookProvider.execute(
      {
        isbn: data.isbn,
      },
      conditions,
    );
    if (existingIsbn) {
      await this.errorService.conflict(ModuleName.Book, 'isbn-already-exist');
    }

    const book = await this.bookRepository.update({ id }, data);

    if (!book) {
      await this.errorService.notFound(ModuleName.Book, 'book-not-found');
    }

    return book as BookEntity;
  }
}
