import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ErrorService } from '../exceptions';
import { ModuleName } from '../enums';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly errorService: ErrorService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user?: { role?: string };
    };

    if (req.user?.role !== 'admin') {
      await this.errorService.unauthorized(
        ModuleName.Common,
        'permission-denied',
      );
      return false;
    }

    return true;
  }
}
