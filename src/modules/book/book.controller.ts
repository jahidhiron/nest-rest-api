import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookFacade } from './providers';
import { Serialize } from '@/common';
import { CreateBookDto, GetBookDto, GetBooksDto, UpdateBookDto } from './dtos';
import { BookListDocs } from './swaggers/book-list.swagger';
import { User } from '@/common/decorators';
import { AdminGuard, AuthGuard, AuthorGuard } from '@/common/guards';
import { IRequestParams } from '@/common/interfaces';
import { UserPayload } from '@/common/decorators/interfaces';
import { BookEntity } from './entities';
import { IFindAll } from '@/common/repositories/types';
import { ModuleName } from '@/common/enums';
import { BookDetailDocs } from './swaggers/book-detail.swagger';
import { UpdateBookDocs } from './swaggers/update-book.swagger';
import { DeleteBookDocs } from './swaggers/delete-book.swagger';
import { SuccessService } from '@/shared/services';
import { CreateBookDocs } from './swaggers/create-book.swagger';

@Controller('books')
export class BookController {
  constructor(
    private readonly successService: SuccessService,
    private readonly bookFacade: BookFacade,
  ) {}
  @Serialize(GetBooksDto)
  @Get('/')
  @BookListDocs()
  async findMany(@Query() query: IRequestParams) {
    const results = await this.bookFacade.findMany.execute(query);
    return this.successService.ok<IFindAll<BookEntity, 'books'>>(
      ModuleName.Book,
      'book-list',
      results,
    );
  }

  @Serialize(GetBookDto)
  @Get('/:id')
  @BookDetailDocs()
  async detail(@Param('id') id: number) {
    const user = await this.bookFacade.userDetail.execute(id);
    return this.successService.ok<BookEntity>(
      ModuleName.Book,
      'book-detail',
      user,
    );
  }

  @Serialize(GetBookDto)
  @UseGuards(AuthorGuard)
  @UseGuards(AuthGuard)
  @Post()
  @CreateBookDocs()
  async create(@Body() dto: CreateBookDto, @User() userPayload: UserPayload) {
    const book = await this.bookFacade.create.execute(dto, userPayload);
    return this.successService.ok<BookEntity>(
      ModuleName.Book,
      'create-book',
      book,
    );
  }

  @Serialize(GetBookDto)
  @UseGuards(AuthorGuard)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  @UpdateBookDocs()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBookDto,
    @User() userPayload: UserPayload,
  ) {
    await this.bookFacade.userDetail.execute(id, userPayload);
    const user = await this.bookFacade.update.execute(id, dto);
    return this.successService.ok<BookEntity>(
      ModuleName.Book,
      'update-book',
      user,
    );
  }

  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @Delete('/:id')
  @DeleteBookDocs()
  async deleteUser(@Param('id') id: number) {
    await this.bookFacade.remove.execute(id);
    return this.successService.noContent<BookEntity>(
      ModuleName.Book,
      'delete-book',
    );
  }
}
