import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'The refresh token issued during authentication. Used to obtain a new access token without requiring the user to log in again.',
  })
  @IsNotEmpty()
  refreshToken: string;
}
