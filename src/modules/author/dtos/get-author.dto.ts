import { Expose, Type } from 'class-transformer';
import { BookEntity } from '@/modules/book/entities';

export class GetAuthorDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  bio?: string;

  @Expose()
  birthDate?: Date;

  @Expose()
  @Type(() => BookEntity)
  books: BookEntity[];
}
