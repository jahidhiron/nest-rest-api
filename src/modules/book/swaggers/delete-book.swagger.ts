import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function DeleteBookDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a user',
      description:
        '**IMPORTANT:** Only admin users can delete books. Deletes a book by its ID. No request body required.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User deleted successful',
      schema: {
        example: {
          method: HttpMethod.DELETE,
          success: true,
          status: HTTP_STATUS.OK.context,
          statusCode: HTTP_STATUS.OK.status,
          path: '/api/v1/users/2',
          timestamp: '2025-07-02T12:07:11.098Z',
          message: 'User deleted successful',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
      content: {
        'application/json': {
          examples: {
            unauthorized: {
              summary: 'Unauthorized (No token or invalid)',
              value: {
                success: false,
                method: HttpMethod.DELETE,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/users/2',
                message: 'Unauthorized',
                timestamp: '2025-07-02T11:31:35.041Z',
              },
            },
            permissionDenied: {
              summary: 'Permission Denied (Deleting someone else’s data)',
              value: {
                success: false,
                method: HttpMethod.DELETE,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/users/2',
                message: 'Permission denied',
                timestamp: '2025-07-02T12:00:54.662Z',
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
          method: HttpMethod.DELETE,
          status: HTTP_STATUS.NOT_FOUND.context,
          statusCode: HTTP_STATUS.NOT_FOUND.status,
          path: '/api/v1/users/2',
          message: 'User not found',
          timestamp: '2025-07-02T12:10:00.000Z',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.DELETE,
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
          path: '/api/v1/users/2',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
