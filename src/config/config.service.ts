import { Injectable } from '@nestjs/common';
import { AppConfigService } from './app';
import { SwaggerConfigService } from './swagger';
import { JwtConfigService } from './jwt';
import { SqliteDbConfigService } from './db';
import { MailConfigService } from './mail';
import { RedisConfigService } from './redis';

@Injectable()
export class ConfigService {
  constructor(
    public readonly app: AppConfigService,
    public readonly swagger: SwaggerConfigService,
    public readonly jwt: JwtConfigService,
    public readonly sqliteDb: SqliteDbConfigService,
    public readonly mail: MailConfigService,
    public readonly redis: RedisConfigService,
  ) {}
}
