import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserVerificationTokenDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'Valid email address of the user',
  })
  @IsEmail()
  email: string;
}
