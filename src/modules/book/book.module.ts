import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@/common/common.module';
import { SharedModule } from '@/shared/shared.module';
import { ConfigModule } from '@/config';
import { BookEntity } from './entities';
import { BookController } from './book.controller';
import { BookFacade } from './providers';
import { BookRepository } from './repositories';
import { CreateBookProvider } from './providers/create-book.provider';
import { UpdateBookProvider } from './providers/update-book.provider';
import { FindOneBookProvider } from './providers/find-one-book.provider';
import { FindBooksProvider } from './providers/find-books.provider';
import { RemoveBookProvider } from './providers/remove-book.provider';
import { BookDetailProvider } from './providers/book-detail.provider';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    CommonModule,
    SharedModule,
    ConfigModule,
    UserModule,
  ],
  controllers: [BookController],
  providers: [
    BookFacade,
    BookRepository,
    CreateBookProvider,
    UpdateBookProvider,
    FindOneBookProvider,
    FindBooksProvider,
    RemoveBookProvider,
    BookDetailProvider,
    FindOneBookProvider,
  ],
  exports: [BookFacade, BookRepository],
})
export class BookModule {}
