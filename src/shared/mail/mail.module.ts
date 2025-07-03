import { Module } from '@nestjs/common';
import { MailgunService } from './mailgun.service';
import { ConfigModule } from '@/config';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [ConfigModule, CommonModule],
  providers: [MailgunService],
  exports: [MailgunService],
})
export class MailModule {}
