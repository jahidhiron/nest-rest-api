import { HTTP_STATUS } from '@/shared';
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import { IResponse } from './interfaces';

@Injectable({ scope: Scope.REQUEST })
export class ResponseService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly i18n: I18nService,
  ) {}

  private getLangFromRequest(): string {
    const headerKeys = ['x-language', 'accept-language', 'content-language'];

    for (const key of headerKeys) {
      const headerValue = this.request.headers[key.toLowerCase()];
      if (!headerValue) continue;

      if (Array.isArray(headerValue)) {
        if (headerValue.length > 0) return headerValue[0];
      } else if (typeof headerValue === 'string' && headerValue.trim()) {
        if (key === 'accept-language') {
          const langs = headerValue.split(',').map((l) => l.trim());
          if (langs.length) return langs[0];
        } else {
          return headerValue.trim();
        }
      }
    }

    return 'en';
  }

  private async buildResponse<T extends object = any>(
    module: string,
    success: boolean,
    status: keyof typeof HTTP_STATUS,
    key: string,
    rest?: T,
  ): Promise<IResponse<T>> {
    const { method, path: reqPath } = this.request;
    const statusCode = HTTP_STATUS[status]?.status || (success ? 200 : 500);
    const statusText =
      HTTP_STATUS[status]?.context || (success ? 'HTTP_SUCCESS' : 'HTTP_ERROR');

    const msgKey = `${module}.${key}`;
    const message: string = await this.i18n.translate(msgKey, {
      lang: this.getLangFromRequest(),
    });

    const response: IResponse<T> = {
      method,
      success,
      status: statusText,
      statusCode,
      path: reqPath,
      timestamp: new Date().toISOString(),
      message,
    };

    if (rest && typeof rest === 'object' && !Array.isArray(rest)) {
      response.data = { ...rest };
    }

    return response;
  }

  async success<T extends object = any>(
    module: string,
    status: keyof typeof HTTP_STATUS,
    key: string,
    rest?: T,
  ): Promise<IResponse<T>> {
    return this.buildResponse<T>(module, true, status, `success.${key}`, rest);
  }

  async error<T extends object = any>(
    module: string,
    status: keyof typeof HTTP_STATUS,
    key: string,
    rest?: T,
  ): Promise<IResponse<T>> {
    return this.buildResponse<T>(module, false, status, `error.${key}`, rest);
  }
}
