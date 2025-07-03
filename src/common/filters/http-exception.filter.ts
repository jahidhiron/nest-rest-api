import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/logger.service';
import { ignoredLogPaths } from '../logger';
import { HTTP_STATUS } from '@/shared';
import { ErrorResponse, FieldError } from './types';

type HttpStatusEntry = {
  context: string;
  status: number;
};

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  getContextByStatusCode(statusCode: number): string | undefined {
    const entries = Object.values(HTTP_STATUS) as HttpStatusEntry[];
    const found = entries.find((entry) => entry.status === statusCode);
    return found?.context;
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode: number = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const status = this.getContextByStatusCode(statusCode) || 'HTTP_ERROR';

    const errorResponse = exception.getResponse();

    let message: string = 'test';
    let errors: FieldError[] | null = null;

    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (typeof errorResponse === 'object' && errorResponse !== null) {
      const res = errorResponse as Record<string, any>;

      if ('message' in res) {
        message = res.message as string;
      }

      if ('errors' in res) {
        errors = res.errors as FieldError[];
      }
    }

    // Skip logging
    if (
      ignoredLogPaths.some((path) =>
        typeof path === 'string'
          ? request.url === path
          : path instanceof RegExp && path.test(request.url),
      )
    ) {
      return response.status(statusCode).send();
    }

    const trace = HttpStatus.INTERNAL_SERVER_ERROR
      ? exception.stack
      : undefined;

    this.logger.error(
      `[${request.method}] ${request.url} → ${statusCode} | Message: ${JSON.stringify(
        message,
      )}`,
      trace,
      'HTTP_ERROR',
    );

    const finalResponse: ErrorResponse = {
      success: false,
      method: request.method,
      status,
      statusCode,
      path: request.url,
      message,
      timestamp: new Date().toISOString(),
    };

    if (errors) {
      finalResponse.errors = errors;
    }

    // if (process.env.NODE_ENV === 'development' && trace) {
    //   finalResponse.stack = trace;
    // }
    finalResponse.stack = trace;

    response.status(statusCode).json(finalResponse);
  }
}
