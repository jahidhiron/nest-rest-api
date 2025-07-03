import { Injectable } from '@nestjs/common';
import { CreateBookProvider } from './create-book.provider';
import { UpdateBookProvider } from './update-book.provider';
import { FindOneBookProvider } from './find-one-book.provider';
import { FindBooksProvider } from './find-books.provider';
import { RemoveBookProvider } from './remove-book.provider';
import { BookDetailProvider } from './book-detail.provider';

@Injectable()
export class BookFacade {
  constructor(
    public readonly create: CreateBookProvider,
    public readonly update: UpdateBookProvider,
    public readonly findOne: FindOneBookProvider,
    public readonly findMany: FindBooksProvider,
    public readonly remove: RemoveBookProvider,
    public readonly userDetail: BookDetailProvider,
  ) {}
}
