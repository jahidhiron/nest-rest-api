import { Injectable } from '@nestjs/common';
import { QueryFilter } from '@/shared/types';
import { BookRepository } from '../repositories';
import { BookEntity } from '../entities';
import { IConditions } from '@/helpers/interfaces';

@Injectable()
export class FindOneBookProvider {
  constructor(private bookRepository: BookRepository) {}

  execute(
    query: QueryFilter<BookEntity>,
    conditions?: IConditions[],
    relations?: string[],
  ): Promise<BookEntity | null> {
    return this.bookRepository.findOne({ query, conditions, relations });
  }
}
