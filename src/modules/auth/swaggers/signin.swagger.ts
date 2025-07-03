import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { SigninDto } from '../dtos/signin.dto';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function SigninSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'User Signin',
      description:
        'Allows an existing user to sign in using email and password. Returns user data, access and refresh tokens.',
    }),
    ApiBody({ type: SigninDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Signin successful',
      schema: {
        example: {
          method: HttpMethod.POST,
          success: true,
          status: HTTP_STATUS.CREATED.context,
          statusCode: HTTP_STATUS.CREATED.status,
          path: '/api/v1/auth/signin',
          timestamp: '2025-06-30T09:00:17.327Z',
          message: 'Signin successful',
          data: {
            user: {
              id: 3,
              firstName: 'Jahid',
              lastName: 'Hiron',
              email: 'test2@gmail.com',
              role: 'author',
              verified: false,
            },
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
              field: 'email',
              message: 'Email must be an email',
            },
            {
              field: 'password',
              message: 'Password should not be empty',
            },
          ],
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.UNAUTHORIZED.context,
          statusCode: HTTP_STATUS.UNAUTHORIZED.status,
          path: '/api/v1/auth/signin',
          message: 'Invalid credentials',
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
