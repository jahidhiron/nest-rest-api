import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'Jahid',
    description: 'First name of the user',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Hiron',
    description: 'Last name of the user',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'test@example.com',
    description: 'Valid email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'author',
    description: 'Role of the user',
    enum: ['admin', 'author', 'user'],
  })
  @IsNotEmpty()
  @IsIn(['admin', 'author', 'user'])
  role: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password (minimum 6 characters)',
  })
  @MinLength(6)
  password: string;
}
