import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';
import { RefreshTokenDto } from '../dtos';

export function RefreshTokenSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'User Signin',
      description:
        'Allows an existing user to sign in using email and password. Returns user data, access and refresh tokens.',
    }),
    ApiBody({ type: RefreshTokenDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Generate refresh tokens',
      schema: {
        example: {
          method: HttpMethod.POST,
          success: true,
          status: HTTP_STATUS.CREATED.context,
          statusCode: HTTP_STATUS.CREATED.status,
          path: '/api/v1/auth/signin',
          timestamp: '2025-06-30T09:00:17.327Z',
          message: 'Generate refresh tokens successful',
          data: {
            token: {
              accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.BAD_REQUEST.context,
          statusCode: HTTP_STATUS.BAD_REQUEST.status,
          path: '/api/v1/auth/signin',
          message: 'Validation Error',
          timestamp: '2025-06-30T08:58:31.428Z',
          errors: [
            {
              field: 'refreshToken',
              message: 'Refresh token should not be empty',
            },
          ],
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.UNAUTHORIZED.context,
          statusCode: HTTP_STATUS.UNAUTHORIZED.status,
          path: '/api/v1/auth/signin',
          message: 'Unauthorized',
          timestamp: '2025-06-30T08:59:20.704Z',
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
          path: '/api/v1/auth/signin',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
