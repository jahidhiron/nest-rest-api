import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '@/modules/user/entities';
import { ConfigService } from '../config.service';
import { LoginHistory, VerificationTokenEntity } from '@/modules/auth/entities';
import { AuthorEntity } from '@/modules/author/entities';
import { BookEntity } from '@/modules/book/entities';

export const typeOrmAsyncConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const dbConfig = configService.sqliteDb.database;

  const config: TypeOrmModuleOptions = {
    ...dbConfig,
    entities: [
      UserEntity,
      VerificationTokenEntity,
      LoginHistory,
      AuthorEntity,
      BookEntity,
    ],
  };

  return Promise.resolve(config);
};
