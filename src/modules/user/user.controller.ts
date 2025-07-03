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
import { UserFacade } from './providers';
import { AdminGuard, AuthGuard } from '@/common/guards';
import { User } from '@/common/decorators';
import { ICurrentUser, UserPayload } from '@/common/decorators/interfaces';
import { SuccessService } from '@/shared/services';
import { ModuleName } from '@/common/enums';
import { UserEntity } from './entities';
import { GetUserDto, GetUsersDto, UpdateUserDto } from './dto';
import { Serialize } from '@/common';
import { IFindAll } from '@/common/repositories/types';
import { IRequestParams } from '@/common/interfaces';
import {
  CurrentUserDocs,
  DeleteUserDocs,
  UpdateUserDocs,
  UserDetailDocs,
  UserListDocs,
} from './swaggers';

@Controller('users')
export class UserController {
  constructor(
    private readonly successService: SuccessService,
    private readonly userFacade: UserFacade,
  ) {}

  @UseGuards(AuthGuard)
  @Get('current-user')
  @CurrentUserDocs()
  async currentUser(@User() user: UserPayload) {
    const result = await this.userFacade.currentUser.execute(user);
    return this.successService.ok<ICurrentUser>(
      ModuleName.User,
      'current-user',
      result,
    );
  }

  @Serialize(GetUsersDto)
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @Get('/')
  @UserListDocs()
  async findMany(
    @Query() query: IRequestParams,
    @User() userPayload: UserPayload,
  ) {
    const user = await this.userFacade.findMany.execute(query, userPayload);
    return this.successService.ok<IFindAll<UserEntity, 'users'>>(
      ModuleName.User,
      'user-list',
      user,
    );
  }

  @Serialize(GetUserDto)
  @UseGuards(AuthGuard)
  @Get('/:id')
  @UserDetailDocs()
  async userDetail(@Param('id') id: number, @User() userPayload: UserPayload) {
    const user = await this.userFacade.userDetail.execute(id, userPayload);

    return this.successService.ok<ICurrentUser>(
      ModuleName.User,
      'user-detail',
      user,
    );
  }

  @Serialize(GetUserDto)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  @UpdateUserDocs()
  async updateUser(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
    @User() userPayload: UserPayload,
  ) {
    await this.userFacade.userDetail.execute(id, userPayload);
    const user = await this.userFacade.update.execute(id, dto);

    return this.successService.ok<UserEntity>(
      ModuleName.User,
      'update-user',
      user,
    );
  }

  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @Delete('/:id')
  @DeleteUserDocs()
  async deleteUser(@Param('id') id: number) {
    await this.userFacade.remove.execute(id);
    return this.successService.noContent<UserEntity>(
      ModuleName.User,
      'delete-user',
    );
  }
}
