import { Expose, Type } from 'class-transformer';
import { MetaDto } from '@/common/dtos';
import { GetBookDto } from './get-book.dto';

export class GetBooksDto {
  @Expose()
  @Type(() => GetBookDto)
  books: GetBookDto[];

  @Expose()
  @Type(() => MetaDto)
  meta: MetaDto;
}
