import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'Valid email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password',
  })
  @IsNotEmpty()
  password: string;
}
