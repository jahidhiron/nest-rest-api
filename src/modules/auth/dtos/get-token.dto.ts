import { Expose } from 'class-transformer';

export class GetTokenDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
