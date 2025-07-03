import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsExcluded } from '@/common/validators';
import { ApiHideProperty } from '@nestjs/swagger';

class BaseUpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const),
) {}

export class UpdateUserDto extends BaseUpdateUserDto {
  @ApiHideProperty()
  @IsExcluded({ message: 'Email cannot be updated' })
  email?: string;
}
