import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('env') as string;
  }

  get logDir(): string {
    return this.configService.get<string>('logDir') as string;
  }

  get dev(): string {
    return this.configService.get<string>('dev') as string;
  }

  get staging(): string {
    return this.configService.get<string>('staging') as string;
  }

  get prod(): string {
    return this.configService.get<string>('prod') as string;
  }

  get port(): string {
    return this.configService.get<string>('port') as string;
  }

  get corsOrigin(): string {
    return this.configService.get<string>('corsOrigin') as string;
  }

  get companyName(): string {
    return this.configService.get<string>('companyName') as string;
  }

  get apiBaseUrl(): string {
    return this.configService.get<string>('apiBaseUrl') as string;
  }

  get supportEmail(): string {
    return this.configService.get<string>('supportEmail') as string;
  }
}
