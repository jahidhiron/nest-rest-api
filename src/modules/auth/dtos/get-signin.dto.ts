import { GetUserDto } from '@/modules/user/dto';
import { Expose, Type } from 'class-transformer';
import { GetTokenDto } from './get-token.dto';

export class GetSigninDto {
  @Expose()
  @Type(() => GetUserDto)
  user: GetUserDto;

  @Expose()
  @Type(() => GetTokenDto)
  token: GetTokenDto;
}
