import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDatabaseConfig } from './interfaces';

@Injectable()
export class SqliteDbConfigService {
  constructor(private configService: ConfigService) {}

  get database(): IDatabaseConfig {
    return this.configService.get<IDatabaseConfig>(
      'database',
    ) as IDatabaseConfig;
  }
}
