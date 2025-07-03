import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities';
import { BaseRepository } from '@/common/repositories';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(protected readonly dataSource: DataSource) {
    super(dataSource, UserEntity, 'usr');
  }
}
