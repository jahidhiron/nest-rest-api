import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SwaggerConfigService {
  constructor(private configService: ConfigService) {}

  get user(): string {
    return this.configService.get<string>('swaggerUser') as string;
  }

  get password(): string {
    return this.configService.get<string>('swaggerPassword') as string;
  }

  get swaggerDevelopmentBaseUrl(): string {
    return this.configService.get<string>(
      'swaggerDevelopmentBaseUrl',
    ) as string;
  }

  get swaggerLiveBaseUrl(): string {
    return this.configService.get<string>('swaggerLiveBaseUrl') as string;
  }
}
