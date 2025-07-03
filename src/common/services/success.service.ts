import { Injectable, Scope } from '@nestjs/common';
import { HTTP_STATUS } from '@/shared';
import { IResponse } from '../services/interfaces';
import { ResponseService } from '../services';

@Injectable({ scope: Scope.REQUEST })
export class SuccessService {
  constructor(private readonly responseService: ResponseService) {}

  ok<T extends object = any>(
    module: string,
    key: string,
    rest?: T,
  ): Promise<IResponse<T>> {
    return this.responseService.success<T>(
      module,
      HTTP_STATUS.OK.context,
      key,
      rest,
    );
  }

  created<T extends object = any>(
    module: string,
    key: string,
    data?: T,
  ): Promise<IResponse<T>> {
    return this.responseService.success<T>(
      module,
      HTTP_STATUS.CREATED.context,
      key,
      data,
    );
  }

  accepted<T extends object = any>(
    module: string,
    key: string,
    data?: T,
  ): Promise<IResponse<T>> {
    return this.responseService.success<T>(
      module,
      HTTP_STATUS.ACCEPTED.context,
      key,
      data,
    );
  }

  noContent<T extends object = any>(
    module: string,
    key: string,
    data?: T,
  ): Promise<IResponse<T>> {
    return this.responseService.success<T>(
      module,
      HTTP_STATUS.NO_CONTENT.context,
      key,
      data,
    );
  }
}
