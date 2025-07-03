import { Module } from '@nestjs/common';
import { ErrorService } from './exceptions';
import { ResponseService } from './services';
import { AppLogger } from './logger';

@Module({
  providers: [ResponseService, ErrorService, AppLogger],
  exports: [ErrorService, ResponseService, AppLogger],
})
export class CommonModule {}
