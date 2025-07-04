import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ModuleName } from '@/common/enums';
import { AdminGuard, AuthGuard, AuthorGuard } from '@/common/guards';
import { User } from '@/common/decorators';
import { UserPayload } from '@/common/decorators/interfaces';
import { IRequestParams } from '@/common/interfaces';
import { IFindAll } from '@/common/repositories/types';
import { AuthorFacade } from './providers';
import { GetAuthorDto, GetAuthorsDto, UpdateAuthorDto } from './dtos';
import { AuthorEntity } from './entities';
import { SuccessService } from '@/shared/services';
import { Serialize } from '@/common';
import {
  AuthorDetailDocs,
  AuthorListDocs,
  DeleteAuthorDocs,
  UpdateAuthorDocs,
} from './swaggers';

@Controller('authors')
export class AuthorController {
  constructor(
    private readonly successService: SuccessService,
    private readonly authorFacade: AuthorFacade,
  ) {}
  @Serialize(GetAuthorsDto)
  @UseGuards(AuthGuard)
  @Get('/')
  @AuthorListDocs()
  async findMany(@Query() query: IRequestParams) {
    const results = await this.authorFacade.findMany.execute(query);
    return this.successService.ok<IFindAll<AuthorEntity, 'authors'>>(
      ModuleName.Author,
      'author-list',
      results,
    );
  }

  @Serialize(GetAuthorDto)
  @UseGuards(AuthGuard)
  @Get('/:id')
  @AuthorDetailDocs()
  async detail(@Param('id') id: number, @User() userPayload: UserPayload) {
    const user = await this.authorFacade.userDetail.execute(id, userPayload);
    return this.successService.ok<AuthorEntity>(
      ModuleName.Author,
      'author-detail',
      user,
    );
  }

  @Serialize(GetAuthorDto)
  @UseGuards(AuthorGuard)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  @UpdateAuthorDocs()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateAuthorDto,
    @User() userPayload: UserPayload,
  ) {
    await this.authorFacade.userDetail.execute(id, userPayload);
    const user = await this.authorFacade.update.execute(id, dto);
    return this.successService.ok<AuthorEntity>(
      ModuleName.Author,
      'update-author',
      user,
    );
  }

  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @Delete('/:id')
  @DeleteAuthorDocs()
  async remove(@Param('id') id: number) {
    await this.authorFacade.remove.execute(id);
    return this.successService.noContent<AuthorEntity>(
      ModuleName.Author,
      'delete-author',
    );
  }
}
