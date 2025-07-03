import { Injectable } from '@nestjs/common';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';
import { BookRepository } from '../repositories';
import { BookEntity } from '../entities';

@Injectable()
export class RemoveBookProvider {
  constructor(
    private bookRepository: BookRepository,
    private errorService: ErrorService,
  ) {}

  async execute(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.remove({ id });

    if (!book) {
      await this.errorService.notFound(ModuleName.Book, 'book-not-found');
    }

    return book as BookEntity;
  }
}
