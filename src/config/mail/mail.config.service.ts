import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfigService {
  constructor(private configService: ConfigService) {}

  get mailgunDomain(): string {
    return this.configService.get<string>('mailgunDomain') as string;
  }

  get mailgunApiKey(): string {
    return this.configService.get<string>('mailgunApiKey') as string;
  }

  get mailgunSenderEmail(): string {
    return this.configService.get<string>('mailgunSenderEmail') as string;
  }
}
