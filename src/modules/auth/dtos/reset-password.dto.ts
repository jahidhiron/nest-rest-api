import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'Valid email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password (minimum 6 characters)',
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'a2945080fe97a87eb5ec0a3953703d1bece2ffd9fb824d08c5b663794f8bfbdd',
    description: 'Valid verification token of the user',
  })
  @IsNotEmpty()
  token: string;
}
