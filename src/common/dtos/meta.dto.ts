import { Expose } from 'class-transformer';

export class MetaDto {
  @Expose()
  total: number;

  @Expose()
  pages: number;

  @Expose()
  currentPage: number;
}
