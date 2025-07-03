import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get secretAccessToken(): string {
    return this.configService.get<string>('jwtSecretAccessToken') as string;
  }

  get secretRefreshToken(): string {
    return this.configService.get<string>('jwtSecretRefreshToken') as string;
  }

  get accessTokenExpiredIn(): number {
    return this.configService.get<number>('jwtAccessTokenExpiredIn') as number;
  }

  get refreshTokenExpiredIn(): number {
    return this.configService.get<number>('jwtRefreshTokenExpiredIn') as number;
  }

  get issuer(): string {
    return this.configService.get<string>('jwtIssuer') as string;
  }

  get audience(): string {
    return this.configService.get<string>('jwtAudience') as string;
  }
}
