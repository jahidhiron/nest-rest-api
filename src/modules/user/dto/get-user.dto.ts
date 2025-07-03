import { GetAuthorDto } from '@/modules/author/dtos';
import { Expose, Type } from 'class-transformer';

export class GetUserDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  verified: string;

  @Expose()
  avatar: string;

  @Expose()
  @Type(() => GetAuthorDto)
  author?: GetAuthorDto;
}
