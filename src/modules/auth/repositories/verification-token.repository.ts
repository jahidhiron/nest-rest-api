import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { VerificationTokenEntity } from '../entities';
import { BaseRepository } from '@/common/repositories';

@Injectable()
export class VerificationTokenRepository extends BaseRepository<VerificationTokenEntity> {
  constructor(protected readonly dataSource: DataSource) {
    super(dataSource, VerificationTokenEntity, 'vt');
  }
}
