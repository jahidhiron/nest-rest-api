import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/logger.service';
import { ConfigService } from '@/config';
import { ErrorResponse, FieldError } from './types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly ignoredLogPaths: (string | RegExp)[] = [];

  constructor(
    private readonly logger: AppLogger,
    private configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const status = HttpStatus[statusCode] || 'INTERNAL_SERVER_ERROR';

    let message: string = 'Internal server error';
    let errors: FieldError[] | undefined;
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        if ('message' in res) message = res.message as string;
        if ('errors' in res) errors = res.errors as FieldError[];
      }
      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    const shouldSkipLogging = this.ignoredLogPaths.some((path) =>
      typeof path === 'string'
        ? request.url === path
        : path instanceof RegExp && path.test(request.url),
    );

    if (!shouldSkipLogging) {
      this.logger.error(
        `[${request.method}] ${request.url} → ${statusCode} | Message:`,
        stack,
      );
    }

    const errorResponse: ErrorResponse = {
      success: false,
      method: request.method,
      status,
      statusCode,
      path: request.url,
      message,
      timestamp: new Date().toISOString(),
    };

    if (errors) {
      errorResponse.errors = errors;
    }

    if (this.configService.app.dev && stack) {
      errorResponse.stack = stack;
    }

    if (this.configService.app.prod && stack) {
      // send an email to authority
    }

    response.status(statusCode).json(errorResponse);
  }
}
