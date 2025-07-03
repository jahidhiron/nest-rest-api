import { ITokenPayload } from '@/modules/auth/providers/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  <K extends keyof ITokenPayload>(
    data: K | undefined,
    ctx: ExecutionContext,
  ): ITokenPayload[K] | ITokenPayload => {
    const request = ctx.switchToHttp().getRequest() as Request & {
      user?: ITokenPayload;
    };
    const user = request.user as ITokenPayload;
    return data ? user[data] : user;
  },
);
