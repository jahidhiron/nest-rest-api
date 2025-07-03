import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function LogoutDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'User logout',
      description:
        'Logs out the authenticated user by invalidating their current session or tokens, ensuring they no longer have access to protected resources.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Logout successful',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          success: false,
          method: HttpMethod.POST,
          status: HTTP_STATUS.UNAUTHORIZED.context,
          statusCode: HTTP_STATUS.UNAUTHORIZED.status,
          path: '/api/v1/auth/logout',
          message: 'Unauthorized',
          timestamp: '2025-07-02T11:31:35.041Z',
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
          path: '/api/v1/auth/logout',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
