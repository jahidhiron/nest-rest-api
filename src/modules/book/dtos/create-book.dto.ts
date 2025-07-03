import { BOOK_GENRES } from '@/shared';
import { IsString, IsOptional, IsDate, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Title of the book',
    example: 'All you need to know Nestjs',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'ISBN of the book',
    example: 'IBNSS-25000',
  })
  @IsString()
  isbn: string;

  @ApiPropertyOptional({
    description: 'Published date of the book (ISO format)',
    example: '2013-01-02T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  publishedDate?: Date;

  @ApiPropertyOptional({
    description: `Genre of the book (optional). Must be one of: ${BOOK_GENRES.join(', ')}`,
    enum: BOOK_GENRES,
    example: 'Classic',
  })
  @IsOptional()
  @IsIn(BOOK_GENRES)
  genre?: string;
}
