import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CommonModule } from '@/common/common.module';
import { UserFacade } from './providers';
import { UpdateUserProvider } from './providers/update-user.provider';
import { FindUsersProvider } from './providers/find-users.provider';
import { RemoveUserProvider } from './providers/remove-user.provider';
import { UserRepository } from './repositories';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserProvider } from './providers/find-one-user.provider';
import { SharedModule } from '@/shared/shared.module';
import { HashService } from '@/common/services';
import { UserController } from './user.controller';
import { ConfigModule } from '@/config';
import { UserDetailProvider } from './providers/user-detail.provider';
import { CurrentUserProvider } from './providers/current-user.provider';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CommonModule,
    SharedModule,
    ConfigModule,
    forwardRef(() => AuthorModule),
  ],
  controllers: [UserController],
  providers: [
    UserFacade,
    UserRepository,
    CreateUserProvider,
    UpdateUserProvider,
    FindUsersProvider,
    RemoveUserProvider,
    UserDetailProvider,
    FindOneUserProvider,
    HashService,
    CurrentUserProvider,
  ],
  exports: [UserModule, UserFacade],
})
export class UserModule {}
