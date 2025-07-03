import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@/common/repositories';
import { BookEntity } from '../entities';

@Injectable()
export class BookRepository extends BaseRepository<BookEntity> {
  constructor(protected readonly dataSource: DataSource) {
    super(dataSource, BookEntity, 'book');
  }
}
