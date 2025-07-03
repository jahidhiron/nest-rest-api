import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@/common/common.module';
import { AuthorController } from './author.controller';
import { ConfigModule } from '@/config';
import { AuthorEntity } from './entities';
import { AuthorFacade } from './providers';
import { AuthorRepository } from './repositories';
import { CreateAuthorProvider } from './providers/create-author.provider';
import { UpdateAuthorProvider } from './providers/update-author.provider';
import { FindOneAuthorProvider } from './providers/find-one-author.provider';
import { FindAuthorsProvider } from './providers/find-authors.provider';
import { RemoveAuthorProvider } from './providers/remove-user.provider';
import { AuthorDetailProvider } from './providers/author-detail.provider';
import { SharedModule } from '@/shared/shared.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorEntity]),
    CommonModule,
    SharedModule,
    ConfigModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthorController],
  providers: [
    AuthorFacade,
    AuthorRepository,
    CreateAuthorProvider,
    UpdateAuthorProvider,
    FindOneAuthorProvider,
    FindAuthorsProvider,
    RemoveAuthorProvider,
    AuthorDetailProvider,
  ],
  exports: [AuthorModule, AuthorFacade],
})
export class AuthorModule {}
