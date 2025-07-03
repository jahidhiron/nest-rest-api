import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { HTTP_STATUS } from '@/shared';
import { HttpMethod } from '@/shared/enums';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';

export function ForgotPasswordSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reset user password with reset token',
      description:
        'This endpoint allows a user to reset their password using a unique token sent to their email. The token is typically generated upon a password reset request and is valid for a limited time.',
    }),
    ApiBody({ type: ForgotPasswordDto }),
    ApiResponse({
      status: HTTP_STATUS.OK.status,
      description: 'Your reset password token sent to your email successful',
    }),
    ApiBadRequestResponse({
      description: 'Validation Error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.BAD_REQUEST.context,
          statusCode: HTTP_STATUS.BAD_REQUEST.status,
          path: '/api/v1/auth/forgot-password',
          message: 'Validation Error',
          timestamp: '2025-06-30T08:22:48.382Z',
          errors: [{ field: 'email', message: 'Email must be an email' }],
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'User not found',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.NOT_FOUND.context,
          statusCode: HTTP_STATUS.NOT_FOUND.status,
          path: '/api/v1/auth/forgot-password',
          message: 'User not found',
          timestamp: '2025-06-30T08:22:48.382Z',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
          path: '/api/v1/auth/forgot-password',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
