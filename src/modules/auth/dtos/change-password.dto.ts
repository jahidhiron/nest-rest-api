import { IsFieldNotMatch } from '@/common/validators';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'oldPassword123',
    description: 'Password (minimum 6 characters)',
  })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'New Password (minimum 6 characters)',
  })
  @MinLength(6)
  @IsFieldNotMatch('oldPassword', {
    message: 'New password must be different from old password',
  })
  newPassword: string;
}
