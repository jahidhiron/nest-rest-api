import { GetAuthorDto } from '@/modules/author/dtos';
import { Expose, Type } from 'class-transformer';

export class GetBookDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  isbn: string;

  @Expose()
  publishedDate?: Date;

  @Expose()
  genre?: string;

  @Expose()
  authorId: number;

  @Expose()
  @Type(() => GetAuthorDto)
  author: GetAuthorDto;
}
