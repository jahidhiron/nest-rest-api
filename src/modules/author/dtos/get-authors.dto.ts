import { Expose, Type } from 'class-transformer';
import { MetaDto } from '@/common/dtos';
import { GetAuthorDto } from './get-author.dto';

export class GetAuthorsDto {
  @Expose()
  @Type(() => GetAuthorDto)
  authors: GetAuthorDto[];

  @Expose()
  @Type(() => MetaDto)
  meta: MetaDto;
}
