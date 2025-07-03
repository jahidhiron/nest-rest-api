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
import { ResetPasswordDto } from '../dtos/reset-password.dto';

export function ResetPasswordSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reset user password',
      description:
        'This endpoint allows a user to reset their password by validating a unique reset token sent to their email. Upon successful validation, the user’s password is updated securely.',
    }),
    ApiBody({ type: ResetPasswordDto }),
    ApiResponse({
      status: HTTP_STATUS.OK.status,
      description: 'Your verification token sent to your email successful',
    }),
    ApiBadRequestResponse({
      description: 'Bad request - validation error or invalid token',
      content: {
        'application/json': {
          examples: {
            validationError: {
              summary: 'Validation Error',
              value: {
                success: false,
                method: HttpMethod.POST,
                status: HTTP_STATUS.BAD_REQUEST.context,
                statusCode: HTTP_STATUS.BAD_REQUEST.status,
                path: '/api/v1/auth/reset-password',
                message: 'Validation Error',
                timestamp: '2025-06-30T08:22:48.382Z',
                errors: [
                  {
                    field: 'email',
                    message: 'Email must be an Email',
                  },
                  {
                    field: 'password',
                    message:
                      'Password must be longer than or equal to 6 characters',
                  },
                  {
                    field: 'token',
                    message: 'Token should not be empty',
                  },
                ],
              },
            },
            invalidToken: {
              summary: 'Invalid Token',
              value: {
                success: false,
                method: HttpMethod.POST,
                status: HTTP_STATUS.BAD_REQUEST.context,
                statusCode: HTTP_STATUS.BAD_REQUEST.status,
                path: '/api/v1/auth/reset-password',
                message: 'Invalid token',
                timestamp: '2025-06-30T08:21:51.772Z',
              },
            },
          },
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
          path: '/api/v1/auth/reset-password',
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
          path: '/api/v1/auth/reset-password',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
