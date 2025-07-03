import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpMethod } from '@/shared/enums';
import { HTTP_STATUS } from '@/shared';

export function UserListDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get list of users',
      description:
        'Returns paginated list of users, supports sorting and searching with query parameters.',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number',
      example: 2,
      type: Number,
    }),
    ApiQuery({
      name: 'size',
      required: false,
      description: 'Page size',
      example: 2,
      type: Number,
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      description:
        'Sort rules as JSON string. E.g. `[{"whom":"id","order":"asc"}]`',
      example: '[{"whom":"id","order":"asc"}]',
      type: String,
    }),
    ApiQuery({
      name: 'q',
      required: false,
      description: 'Search query string',
      example: 'Jhon',
      type: String,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Get user list successful',
      schema: {
        example: {
          method: HttpMethod.GET,
          success: true,
          status: HTTP_STATUS.OK.context,
          statusCode: HTTP_STATUS.OK.status,
          path: '/api/v1/users',
          timestamp: '2025-07-02T12:23:46.378Z',
          message: 'Get user list successful',
          data: {
            users: [
              {
                id: 2,
                firstName: 'Jhon',
                lastName: 'Doe',
                email: 'user1@gmail.com',
                role: 'author',
                verified: false,
                avatar: 'https://google.com/img',
              },
              {
                id: 4,
                firstName: 'Jahid',
                lastName: 'Hiron',
                email: 'user3@gmail.com',
                role: 'user',
                verified: false,
                avatar: null,
              },
            ],
            meta: {
              total: 2,
              pages: 1,
              currentPage: 1,
            },
          },
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
                method: HttpMethod.GET,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/users',
                message: 'Unauthorized',
                timestamp: '2025-07-02T11:31:35.041Z',
              },
            },
            permissionDenied: {
              summary: 'Permission Denied',
              value: {
                success: false,
                method: HttpMethod.GET,
                status: HTTP_STATUS.UNAUTHORIZED.context,
                statusCode: HTTP_STATUS.UNAUTHORIZED.status,
                path: '/api/v1/users',
                message: 'Permission denied',
                timestamp: '2025-07-02T12:00:54.662Z',
              },
            },
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          method: HttpMethod.GET,
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR.context,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
          path: '/api/v1/users',
          message: 'Internal Server Error',
          timestamp: '2025-06-30T08:22:31.685Z',
        },
      },
    }),
  );
}
