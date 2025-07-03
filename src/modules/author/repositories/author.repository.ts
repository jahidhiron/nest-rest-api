import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@/common/repositories';
import { AuthorEntity } from '../entities';

@Injectable()
export class AuthorRepository extends BaseRepository<AuthorEntity> {
  constructor(protected readonly dataSource: DataSource) {
    super(dataSource, AuthorEntity, 'author');
  }
}
