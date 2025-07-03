import { Expose, Type } from 'class-transformer';
import { GetUserDto } from './get-user.dto';
import { MetaDto } from '@/common/dtos';

export class GetUsersDto {
  @Expose()
  @Type(() => GetUserDto)
  users: GetUserDto[];

  @Expose()
  @Type(() => MetaDto)
  meta: MetaDto;
}
