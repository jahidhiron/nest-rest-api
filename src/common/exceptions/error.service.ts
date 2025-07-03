import { HTTP_STATUS } from '@/shared';
import { Injectable, Scope } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ResponseService } from '../services';

@Injectable({ scope: Scope.REQUEST })
export class ErrorService {
  constructor(private readonly responseService: ResponseService) {}

  async badRequest<T extends object = any>(
    module: string,
    key: string,
    data?: T,
    args?: Record<string, any>,
  ): Promise<never> {
    const response = await this.responseService.error<T>(
      module,
      HTTP_STATUS.OK.context,
      key,
      data,
      args,
    );

    throw new HttpException(response, HTTP_STATUS.BAD_REQUEST.status);
  }

  async unauthorized<T extends object = any>(
    module: string,
    key: string,
    data?: T,
    args?: Record<string, any>,
  ): Promise<never> {
    const response = await this.responseService.error<T>(
      module,
      HTTP_STATUS.UNAUTHORIZED.context,
      key,
      data,
      args,
    );
    throw new HttpException(response, HTTP_STATUS.UNAUTHORIZED.status);
  }

  async forbidden<T extends object = any>(
    module: string,
    key: string,
    data?: T,
    args?: Record<string, any>,
  ): Promise<never> {
    const response = await this.responseService.error<T>(
      module,
      HTTP_STATUS.FORBIDDEN.context,
      key,
      data,
      args,
    );
    throw new HttpException(response, HTTP_STATUS.FORBIDDEN.status);
  }

  async notFound<T extends object = any>(
    module: string,
    key: string,
    data?: T,
    args?: Record<string, any>,
  ): Promise<never> {
    const response = await this.responseService.error<T>(
      module,
      HTTP_STATUS.NOT_FOUND.context,
      key,
      data,
      args,
    );
    throw new HttpException(response, HTTP_STATUS.NOT_FOUND.status);
  }

  async conflict<T extends object = any>(
    module: string,
    key: string,
    data?: T,
    args?: Record<string, any>,
  ): Promise<never> {
    const response = await this.responseService.error<T>(
      module,
      HTTP_STATUS.CONFLICT.context,
      key,
      data,
      args,
    );
    throw new HttpException(response, HTTP_STATUS.CONFLICT.status);
  }

  async tooManyRequests<T extends object = any>(
    module: string,
    key: string,
    data?: T,
    args?: Record<string, any>,
  ): Promise<never> {
    const response = await this.responseService.error<T>(
      module,
      HTTP_STATUS.TOO_MANY_REQUESTS.context,
      key,
      data,
      args,
    );
    throw new HttpException(
      response,
      HTTP_STATUS.TOO_MANY_REQUESTS.status,
      args,
    );
  }

  async internalServerError<T extends object = any>(
    module: string,
    key: string,
    data?: T,
    args?: Record<string, any>,
  ): Promise<never> {
    const response = await this.responseService.error<T>(
      module,
      HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
      key,
      data,
      args,
    );
    throw new HttpException(response, HTTP_STATUS.INTERNAL_SERVER_ERROR.status);
  }
}
