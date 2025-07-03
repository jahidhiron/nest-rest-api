import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { HTTP_STATUS } from '@/shared';
import { HttpMethod } from '@/shared/enums';
import { UserVerificationTokenDto } from '../dtos';

export function UserVerificationSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verify user email with verification token',
      description:
        'This endpoint verifies a user’s email address using a unique verification token sent after registration. It activates the user account upon successful validation of the token.',
    }),
    ApiBody({ type: UserVerificationTokenDto }),
    ApiResponse({
      status: HTTP_STATUS.OK.status,
      description: 'Your verification token sent to your email successful',
    }),
    ApiBadRequestResponse({
      description: 'Validation Error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.BAD_REQUEST.context,
          statusCode: HTTP_STATUS.BAD_REQUEST.status,
          path: '/api/v1/auth/user-verification-token',
          message: 'Validation Error',
          timestamp: '2025-06-30T08:22:48.382Z',
          errors: [{ field: 'email', message: 'Email must be an email' }],
        },
      },
    }),
    ApiConflictResponse({
      description: 'User already verified',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.BAD_REQUEST.context,
          statusCode: HTTP_STATUS.BAD_REQUEST.status,
          path: '/api/v1/auth/user-verification-token',
          message: 'User already verified',
          timestamp: '2025-06-30T08:21:51.772Z',
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
          path: '/api/v1/auth/user-verification-token',
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
          path: '/api/v1/auth/user-verification-token',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
