/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { IFindAll } from '@/common/repositories/types';
import { IRequestParams } from '@/common/interfaces';
import { RawQuery } from '@/helpers/interfaces';
import { BookRepository } from '../repositories';
import { BookEntity } from '../entities';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';

@Injectable()
export class FindBooksProvider {
  constructor(
    private bookRepository: BookRepository,
    private errorService: ErrorService,
  ) {}

  async execute(
    params: IRequestParams,
  ): Promise<IFindAll<BookEntity, 'books'>> {
    const rawQueries: RawQuery[] = [];
    const { page, size, sort, q, authorId, ...restQuery } = params;

    if (q) {
      rawQueries.push({
        query: `
          (
            LOWER(book.title) LIKE LOWER(:q)
            OR LOWER(book.isbn) LIKE LOWER(:q)
          )
        `,
        q: `%${q.toLowerCase()}%`,
      });
    }

    if (authorId && isNaN(authorId)) {
      await this.errorService.badRequest(ModuleName.Author, 'author-id');
    }

    if (authorId) {
      rawQueries.push({
        query: `book.author_id = :authorId`,
        authorId: authorId as number,
      });
    }

    const { collection, ...rest } = await this.bookRepository.findAll({
      query: restQuery as Partial<BookEntity>,
      page,
      size,
      sort,
      rawQueries,
    });

    return { ...rest, books: collection };
  }
}
