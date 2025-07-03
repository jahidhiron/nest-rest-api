import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoginHistory } from '../entities';
import { BaseRepository } from '@/common/repositories';

@Injectable()
export class LoginHistoryRepository extends BaseRepository<LoginHistory> {
  constructor(protected readonly dataSource: DataSource) {
    super(dataSource, LoginHistory, 'token');
  }
}
